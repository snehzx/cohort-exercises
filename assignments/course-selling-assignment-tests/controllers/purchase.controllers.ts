import type { Request, Response } from "express";
import { PurchaseCourseSchema } from "../schema";
import { prisma } from "../db.ts";

export const coursePurchase = async (req: Request, res: Response) => {
  const parsedData = PurchaseCourseSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json("missing or invalid input");
  }

  try {
    const { courseId } = parsedData.data;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) {
      return res.status(404).json("course not found");
    }
    await prisma.purchase.create({
      data: {
        userId: req.user!.id,
        courseId,
        amount: course!.price,
      },
    });

    return res.status(200).json(course);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "purchase failed",
    });
  }
};
export const getPurchasedCourse = async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  if (req.user!.id !== userId) {
    return res.status(403).json("forbidden");
  }

  const purchses = await prisma.purchase.findMany({
    where: {
      userId,
    },
    include: {
      course: true,
    },
  });
  res.status(200).json(purchses);
};
