import type { Request, Response } from "express";
import {
  contestSchema,
  dsaSchema,
  mcqsSchema,
  mcqsSubmitSchema,
} from "../validators/schema";
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
  return res.status(201).json(new ApiResponse(contest));
};
export const getContest = async (req: Request, res: Response) => {
  const contestId = req.params.contestId;

  if (typeof contestId !== "string") {
    return res.status(404).json(new ApiError("CONTEST_NOT_FOUND"));
  }
  const existContest = await prisma.contest.findUnique({
    where: {
      id: contestId,
    },
  });

  if (!existContest) {
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
  return res.status(201).json(new ApiResponse(mcqs));
};
export const submitMcq = async (req: Request, res: Response) => {
  const { success, data } = mcqsSubmitSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const { selectedOptionIndex } = data;
  const contestId = req.params.contestId;
  const questionId = req.params.questionId;
  if (typeof contestId !== "string" || typeof questionId !== "string") {
    return res.status(404).json(new ApiError("QUESTION_NOT_FOUND"));
  }
  const existContest = await prisma.contest.findUnique({
    where: { id: contestId },
  });
  if (!existContest) {
    return res.status(400).json(new ApiError("CONTEST_NOT_ACTIVE"));
  }
  if (req.user!.role === "creator" && existContest.creatorId === req.user!.id) {
    return res.status(403).json(new ApiError("FORBIDDEN"));
  }
  const existQuestion = await prisma.mcqQuestion.findUnique({
    where: {
      id: questionId,
      contestId,
    },
  });
  if (!existQuestion) {
    return res.status(404).json(new ApiError("QUESTION_NOT_FOUND"));
  }
  const now = new Date();
  if (existContest.startTime > now || existContest.endTime < now) {
    return res.status(400).json(new ApiError("CONTEST_NOT_ACTIVE"));
  }
  const alreadySubmitedMcq = await prisma.mcqSubmission.findUnique({
    where: {
      userId_questionId: {
        userId: req.user!.id,
        questionId,
      },
    },
  });
  if (alreadySubmitedMcq) {
    return res.status(400).json(new ApiError("ALREADY_SUBMITTED"));
  }
  const crctAns =
    existQuestion.correctOptionIndex === selectedOptionIndex ? true : false;
  const points = crctAns ? existQuestion.points : 0;

  const submitMcqAns = await prisma.mcqSubmission.create({
    data: {
      isCorrect: crctAns,
      pointsEarned: points,
      submittedAt: new Date(),
      selectedOptionIndex,
      userId: req.user!.id,
      questionId,
    },
    select: {
      isCorrect: true,
      pointsEarned: true,
    },
  });
  return res.status(201).json(new ApiResponse(submitMcqAns));
};
export const dsa = async (req: Request, res: Response) => {
  const { success, data } = dsaSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const {
    title,
    description,
    tags,
    points,
    timeLimit,
    memoryLimit,
    testCases,
  } = data;

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
  const dsaQues = await prisma.dsaProblem.create({
    data: {
      title,
      description,
      tags,
      points,
      timeLimit,
      memoryLimit,
      testCases: {
        create: testCases,
      },
      contestId: contest.id,
    },
    select: {
      id: true,
      contestId: true,
    },
  });
  return res.status(201).json(new ApiResponse(dsaQues));
};
export const getLeaderboard = async (req: Request, res: Response) => {
  const contestId = req.params.contestId;
  const userId = req.user!.id;
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

  //aggregate  is used to return total sums but here we want groups of diff users and there total so groupby
  const [users, mcqSubs, bestDsaSubs] = await Promise.all([
    await prisma.user.findMany({
      where: {
        role: "contestee",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),

    prisma.mcqSubmission.groupBy({
      by: ["userId"],
      where: {
        question: {
          contestId,
        },
      },
      _sum: {
        pointsEarned: true,
      },
    }),

    prisma.dsaSubmission.groupBy({
      by: ["userId", "problemId"],
      where: {
        problem: {
          contestId,
        },
      },
      _max: {
        pointsEarned: true,
      },
    }),
  ]);
  const mcqPoints = new Map<string, number>();

  for (const subs of mcqSubs) {
    mcqPoints.set(subs.userId, subs._sum.pointsEarned ?? 0);
  }
  const dsaPoints = new Map<string, number>();

  for (const subs of bestDsaSubs) {
    const userId = subs.userId;
    const bestPoints = subs._max.pointsEarned ?? 0;

    dsaPoints.set(userId, (dsaPoints.get(userId) ?? 0) + bestPoints);
  }

  const leaderBoard = users
    .map((user) => {
      const mcq = mcqPoints.get(user.id) ?? 0;
      const dsa = dsaPoints.get(user.id) ?? 0;

      return {
        userId: user.id,
        name: user.name,
        totalPoints: mcq + dsa,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  let prevPoints: number | null = null;
  let currRank = 0;

  const rankedLeaderBoard = leaderBoard.map((u, i) => {
    if (u.totalPoints !== prevPoints) {
      currRank = i + 1;
      prevPoints = u.totalPoints;
    }
    return {
      ...u,
      rank: currRank,
    };
  });
  return res.status(200).json(new ApiResponse(rankedLeaderBoard));
};
