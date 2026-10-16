import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import prisma from "../db";
import { ApiResponse } from "../utils/apiResponse";
import { dsaSubmitSchema } from "../validators/schema";

export const getProblem = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;

  if (typeof problemId !== "string") {
    return res.status(404).json(new ApiError("PROBLEM_NOT_FOUND"));
  }
  const problem = prisma.dsaProblem.findUnique({
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
      id: problemId,
      isHidden: false,
    },
    select: {
      input: true,
      expectedOutput: true,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse({ ...problem, visibleTestCases: testCases }));
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
  });
  if (!problem) {
    return res.status(404).json(new ApiError("PROBLEM_NOT_FOUND"));
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

  const testCases = await prisma.testCase.findMany({
    where: {
      problemId,
    },
  });
};
