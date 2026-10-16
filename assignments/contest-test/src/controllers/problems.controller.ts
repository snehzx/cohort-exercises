import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import prisma from "../db";
import { ApiResponse } from "../utils/apiResponse";
import { dsaSubmitSchema } from "../validators/schema";
import { judgeSubmission } from "../utils/dsaSoln";

export const getProblem = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;

  if (typeof problemId !== "string") {
    return res.status(404).json(new ApiError("PROBLEM_NOT_FOUND"));
  }
  const problem = await prisma.dsaProblem.findUnique({
    where: {
      id: problemId,
    },
    omit: {
      createdAt: true,
    },
  });
  if (!problem) {
    return res.status(404).json(new ApiError("PROBLEM_NOT_FOUND"));
  }
  const testCases = await prisma.testCase.findMany({
    where: {
      problemId: problem.id,
      isHidden: false,
    },
    select: {
      input: true,
      expectedOutput: true,
    },
  });

  const response = { ...problem, visibleTestCases: testCases };
  return res.status(200).json(new ApiResponse(response));
};
export const submitSoln = async (req: Request, res: Response) => {
  const { success, data } = dsaSubmitSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }

  const { code, language } = data;

  const problemId = req.params.problemId;

  if (typeof problemId !== "string") {
    return res.status(404).json(new ApiError("PROBLEM_NOT_FOUND"));
  }

  const problem = await prisma.dsaProblem.findUnique({
    where: {
      id: problemId,
    },
    include: {
      testCases: true,
      contest: {
        select: {
          creatorId: true,
        },
      },
    },
  });
  if (!problem) {
    return res.status(404).json(new ApiError("PROBLEM_NOT_FOUND"));
  }
  if (
    req.user!.role === "creator" &&
    problem.contest.creatorId === req.user!.id
  ) {
    return res.status(403).json(new ApiError("FORBIDDEN"));
  }
  const contest = await prisma.contest.findUnique({
    where: {
      id: problem.contestId,
    },
  });
  if (!contest) {
    return res.status(400).json(new ApiError("CONTEST_NOT_ACTIVE"));
  }
  const now = new Date();

  if (contest.startTime > now || contest.endTime < now) {
    return res.status(400).json(new ApiError("CONTEST_NOT_ACTIVE"));
  }
  // 4. judge against every test case (hidden ones included)
  const result = await judgeSubmission(code, problem.testCases, {
    timeLimitMs: problem.timeLimit,
    memoryLimitMb: problem.memoryLimit,
  });

  // 5. points are proportional to test cases passed
  const pointsEarned =
    result.totalTestCases === 0
      ? 0
      : Math.floor(
          (problem.points * result.testCasesPassed) / result.totalTestCases,
        );
  const response = await prisma.dsaSubmission.create({
    data: {
      code,
      language: language.toLowerCase(),
      status: result.status,
      pointsEarned,
      testCasesPassed: result.testCasesPassed,
      totalTestCases: result.totalTestCases,
      executionTime: result.executionTime,
      userId: req.user!.id,
      problemId: problem.id,
    },
    select: {
      status: true,
      pointsEarned: true,
      testCasesPassed: true,
      totalTestCases: true,
    },
  });
  return res.status(201).json(new ApiResponse(response));
};
