import mongoose from "mongoose";
import type { Request, Response } from "express";
import { attendanceSchema } from "../validators/schema";
import { ApiError } from "../utils/apiError";
import { Class } from "../models/class.model";
import { ApiResponse } from "../utils/apiResponse";

export const attendance = async (req: Request, res: Response) => {
  const { success, data } = attendanceSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("Invalid request schema"));
  }
  const { classId } = data;

  const existClass = await Class.findById(classId);

  if (!existClass) {
    return res.status(404).json(new ApiError("Class not found"));
  }
  if (req.user?.id !== existClass.teacherId?.toString()) {
    return res.status(403).json(new ApiError("Forbidden, not class teacher"));
  }
  return res.status(200).json(
    new ApiResponse({
      classId,
      startedAt: new Date().toISOString(),
    }),
  );
};
