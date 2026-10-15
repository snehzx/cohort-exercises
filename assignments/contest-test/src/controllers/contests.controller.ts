import type { Request, Response } from "express";
import { contestSchema, mcqsSchema } from "../validators/schema";
import { ApiError } from "../utils/apiError";
import prisma from "../db";
import { ApiResponse } from "../utils/apiResponse";

export const createContest = async (req: Request, res: Response) => {
  const { success, data } = contestSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const { title, description, endTime, startTime } = data;
  const contest = await prisma.contest.create({
    data: {
      title,
      description,
      endTime,
      startTime,
      creatorId: req.user!.id,
    },
  });
  return res.status(201).json(new ApiResponse({ contest }));
};
export const getContest = async (req: Request, res: Response) => {
  const contestId = req.params.contestId;

  if (typeof contestId !== "string") {
    return res.status(404).json(new ApiError("CONTEST_NOT_FOUND"));
  }
  const contest = await prisma.contest.findUnique({
    where: {
      id: contestId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      creatorId: true,
      mcqQuestions: {
        select: {
          id: true,
          questionText: true,
          options: true,
          points: true,
        },
      },
      dsaProblems: {
        select: {
          id: true,
          title: true,
          description: true,
          tags: true,
          points: true,
          timeLimit: true,
          memoryLimit: true,
        },
      },
    },
  });
  return res.status(200).json(
    new ApiResponse({
      ...contest,
      mcqs: contest?.mcqQuestions,
      dsaProblems: contest?.dsaProblems,
    }),
  );
};
export const addMcq = async (req: Request, res: Response) => {
  const { success, data } = mcqsSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const { questionText, options, correctOptionIndex, points } = data;

  const contestId = req.params.contestId;
  if (typeof contestId !== "string") {
    return res.status(404).json(new ApiError("CONTEST_NOT_FOUND"));
  }
  const contest = await prisma.contest.findUnique({
    where: {
      id: contestId,
    },
  });
  if (!contest) {
    return res.status(404).json(new ApiError("CONTEST_NOT_FOUND"));
  }
  const mcqs = await prisma.mcqQuestion.create({
    data: {
      questionText,
      options,
      correctOptionIndex,
      points,
      contestId: contest.id,
    },
    select: {
      id: true,
      contestId: true,
    },
  });
  return res.status(201).json(
    new ApiResponse({
      mcqs,
    }),
  );
};
export const submit = (req: Request, res: Response) => {};
export const dsa = (req: Request, res: Response) => {};
export const getLeaderboard = (req: Request, res: Response) => {};
