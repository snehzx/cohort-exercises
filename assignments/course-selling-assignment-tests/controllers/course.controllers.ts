import type { Request, Response } from "express";
import { CreateCourseSchema, UpdateCourseSchema } from "../schema";
import { z } from "zod";
import { prisma } from "../db.ts";

export const createCourse = async (req: Request, res: Response) => {
  const parsedData = CreateCourseSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "invalid or missing input",
      error: z.flattenError(parsedData.error).fieldErrors,
    });
  }

  const { title, description, price } = parsedData.data;

  const course = await prisma.course.create({
    data: {
      title,
      description,
      price,
      instructor: {
        connect: {
          id: req.user!.id,
        },
      },
    },
  });
  console.log(req.user);
  console.log(course);

  res.status(200).json({
    id: course.id,
  });
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    //const total = await prisma.course.count();
    //const totalPages = Math.ceil(total / limit);
    const courses = await prisma.course.findMany({
      skip,
      take: limit,
    });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      message: "failed to fetch courses",
    });
  }
};

export const getCourseWithLesson = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        lessons: true,
      },
    });
    return res.status(200).json(course);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to fetch course lessons",
    });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const parsedData = UpdateCourseSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "missing or invalid request",
    });
  }
  const courseId = req.params.id as string;

  try {
    const course = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: parsedData.data,
    });
    return res.status(200).json(course);
  } catch (error) {
    console.log(error);
    return res.status(500).json("unable to update course");
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const courseId = req.params.id as string;

  try {
    const deleteCourse = await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return res.status(200).json({
      message: "Course deleted",
      deleteCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to delete course",
    });
  }
};

export const getStats = async (req: Request, res: Response) => {
  const courseId = req.params.id as string;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      purchases: true,
    },
  });
  if (!course) {
    return res.status(404).json("course not found");
  }

  const totalPurchases = await prisma.purchase.count({
    where: {
      courseId,
    },
  });

  const revenue = await prisma.purchase.aggregate({
    where: {
      courseId,
    },
    _sum: {
      amount: true,
    },
  });

  const totalRevenue = revenue._sum.amount ?? 0; // ?? is needed because if there are no purchases prisma retuns amount:null

  return res.status(200).json({
    totalPurchases,
    totalRevenue,
    price: course.price,
  });
};
