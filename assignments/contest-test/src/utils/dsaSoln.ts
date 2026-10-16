import { execFile } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import { randomUUID } from "crypto";

const execFileAsync = promisify(execFile);

// Node itself needs a moment to boot; don't blame that on the user's code.
const STARTUP_GRACE_MS = 300;
const MAX_OUTPUT_BYTES = 5 * 1024 * 1024;

export type Verdict =
  | "accepted"
  | "wrong_answer"
  | "time_limit_exceeded"
  | "runtime_error";

export interface JudgeTestCase {
  input: string;
  expectedOutput: string;
}

export interface JudgeLimits {
  timeLimitMs: number;
  memoryLimitMb: number;
}

export interface JudgeResult {
  status: Verdict;
  testCasesPassed: number;
  totalTestCases: number;
  executionTime: number;
}

interface Query {
  target: number;
  nums: number[];
}

type RunOutcome =
  | { kind: "ok"; output: string; ms: number }
  | { kind: "runtime_error"; ms: number }
  | { kind: "time_limit_exceeded"; ms: number };

function isValidTwoSumOutput(actual: string, input: string): boolean {
  let queries: Query[];

  try {
    queries = parseBatchInput(input);
  } catch {
    return false;
  }

  const lines = actual.replace(/\r\n/g, "\n").split("\n");

  // Remove one trailing empty line produced by the output harness.
  if (lines.length > queries.length && lines[lines.length - 1] === "") {
    lines.pop();
  }

  if (lines.length !== queries.length) {
    return false;
  }

  return queries.every((query, i) => {
    const line = lines[i]!.trim();

    // No-solution queries may return undefined or an empty array.
    const hasSolution = query.nums.some((num, a) =>
      query.nums.some((other, b) => a !== b && num + other === query.target),
    );

    if (line === "" || line === "undefined") {
      return !hasSolution;
    }

    const parts = line.split(/\s+/).map(Number);

    if (parts.length !== 2 || !parts.every(Number.isInteger)) {
      return false;
    }

    const [a, b] = parts;

    if (a === undefined || b === undefined) {
      return false;
    }

    return (
      a >= 0 &&
      b >= 0 &&
      a < query.nums.length &&
      b < query.nums.length &&
      a !== b &&
      query.nums[a]! + query.nums[b]! === query.target
    );
  });
}

/* ---------- 1. find which function to call ---------- */

export function extractFunctionName(code: string): string | undefined {
  const decl = code.match(/function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/);
  if (decl) return decl[1];

  const arrow = code.match(
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/,
  );
  return arrow ? arrow[1] : undefined;
}

/* ---------- 2. turn the test case text into data ----------
   Format:
     <number of queries>
     <n> <target>        (repeated per query)
     <nums...>
*/

function parseBatchInput(input: string): Query[] {
  const tokens = input.trim().split(/\s+/);
  let idx = 0;

  const total = Number(tokens[idx++]);

  if (!Number.isInteger(total) || total < 1) {
    throw new Error("Bad test case: query count");
  }

  const queries: Query[] = [];

  for (let i = 0; i < total; i++) {
    const n = Number(tokens[idx++]);
    const target = Number(tokens[idx++]);

    if (
      !Number.isInteger(n) ||
      n < 0 ||
      !Number.isFinite(target) ||
      idx + n > tokens.length
    ) {
      throw new Error("Bad test case: invalid query");
    }

    const nums = tokens.slice(idx, idx + n).map(Number);
    idx += n;

    if (!nums.every(Number.isFinite)) {
      throw new Error("Bad test case: invalid numbers");
    }

    queries.push({ target, nums });
  }

  if (idx !== tokens.length) {
    throw new Error("Bad test case: unexpected extra input");
  }

  return queries;
}

/* ---------- 3. run the submission against ONE test case ---------- */

export async function runAgainstTestCase(
  code: string,
  functionName: string,
  testCaseInput: string,
  limits: JudgeLimits,
): Promise<RunOutcome> {
  const started = Date.now();
  const elapsed = () => Date.now() - started;

  let queries: Query[];
  try {
    queries = parseBatchInput(testCaseInput);
  } catch {
    return { kind: "runtime_error", ms: elapsed() };
  }

  // The user's code is pasted into a file with a small harness around it.
  // console.log is silenced so debug prints cannot pollute the answer.
  const harness = `
const __write = process.stdout.write.bind(process.stdout);
console.log = console.info = console.debug = () => {};

${code}

const __queries = ${JSON.stringify(queries)};
const __lines = [];
for (const q of __queries) {
  const __result = ${functionName}(q.nums, q.target);

if (__result === undefined || __result === null) {
  __lines.push("undefined");
} else if (Array.isArray(__result)) {
  __lines.push(__result.join(" "));
} else {
  __lines.push(String(__result));
}
}
__write(__lines.join("\\n"));
`;

  const tempFile = path.join(os.tmpdir(), `submission-${randomUUID()}.js`);
  await fs.writeFile(tempFile, harness, "utf-8");

  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      [`--max-old-space-size=${limits.memoryLimitMb}`, tempFile],
      {
        timeout: Math.min(limits.timeLimitMs, 1000),
        killSignal: "SIGKILL",
        maxBuffer: MAX_OUTPUT_BYTES,
        cwd: os.tmpdir(),
        windowsHide: true,
        // do not leak DATABASE_URL, JWT secret etc. into user code
        env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot },
      },
    );
    return { kind: "ok", output: stdout, ms: elapsed() };
  } catch (err) {
    const e = err as {
      killed?: boolean;
      code?: string | number;
      signal?: string;
    };

    if (e.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") {
      return { kind: "runtime_error", ms: elapsed() };
    }

    if (
      e.killed ||
      e.code === "ETIMEDOUT" ||
      (e.signal === "SIGKILL" && e.killed)
    ) {
      return { kind: "time_limit_exceeded", ms: elapsed() };
    }

    return { kind: "runtime_error", ms: elapsed() };
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

/* ---------- 4. compare ---------- */

function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();
}

/* ---------- 5. run ALL test cases and decide the verdict ---------- */

export async function judgeSubmission(
  code: string,
  testCases: JudgeTestCase[],
  limits: JudgeLimits,
): Promise<JudgeResult> {
  const total = testCases.length;
  const functionName = extractFunctionName(code);

  // nothing callable in the submission
  if (!functionName) {
    return {
      status: "runtime_error",
      testCasesPassed: 0,
      totalTestCases: total,
      executionTime: 0,
    };
  }

  let passed = 0;
  let executionTime = 0;
  let failure: Verdict | null = null;

  for (const tc of testCases) {
    const outcome = await runAgainstTestCase(
      code,
      functionName,
      tc.input,
      limits,
    );
    executionTime += outcome.ms;
    console.log({
      outcome: outcome.kind,
      actual:
        outcome.kind === "ok" ? normalizeOutput(outcome.output) : undefined,
      expected: normalizeOutput(tc.expectedOutput),
      elapsed: outcome.ms,
    });
    console.log({
      submittedCode: code,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: outcome.kind === "ok" ? outcome.output : outcome.kind,
    });
    if (
      outcome.kind === "ok" &&
      isValidTwoSumOutput(outcome.output, tc.input)
    ) {
      passed++;
      continue;
    }

    // the first failing test case decides the overall status
    if (!failure) {
      failure = outcome.kind === "ok" ? "wrong_answer" : outcome.kind;
    }

    // too slow: running the remaining cases would only waste time
    if (outcome.kind === "time_limit_exceeded") break;
  }

  return {
    status: failure ?? "accepted",
    testCasesPassed: passed,
    totalTestCases: total,
    executionTime,
  };
}
