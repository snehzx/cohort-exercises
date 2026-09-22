import type { Request, Response } from "express";
import { CreateLessonSchema } from "../schema";
import { prisma } from "../db.ts";

export const postLesson = async (req: Request, res: Response) => {
  const { data, success, error } = CreateLessonSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "invalid or missing input",
    });
  }
  const { title, content, courseId } = data;
  const lesson = await prisma.lesson.create({
    data: {
      title,
      content,
      courseId,
    },
  });
  return res.status(200).json(lesson);
};
export const getLesson = async (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;

  const getLesson = await prisma.lesson.findMany({
    where: {
      courseId,
    },
  });

  return res.status(200).json(getLesson);
};
