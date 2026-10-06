import mongoose from "mongoose";
import type { Request, Response } from "express";
import { addStudentSchema, classSchema } from "../validators/schema";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Class } from "../models/class.model";
import { User } from "../models/user.model";

export const createClass = async (req: Request, res: Response) => {
  const { success, data } = classSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("Invalid request schema"));
  }
  const { className } = data;

  const newClass = await Class.create({
    className,
    teacherId: req.user?.id,
    studentIds: [],
  });
  return res.status(201).json(
    new ApiResponse({
      _id: newClass._id,
      className: newClass.className,
      teacherId: newClass.teacherId,
      studentIds: newClass.studentIds,
    }),
  );
};
export const addStudent = async (req: Request, res: Response) => {
  const { success, data } = addStudentSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json(new ApiError("Invalid request schema"));
  }
  const { studentId } = data;
  const studentObjId = new mongoose.Types.ObjectId(studentId);
  const classId = req.params.id as string;

  const existStudent = await User.findById(studentId);
  if (!existStudent) {
    return res.status(404).json(new ApiError("Student not found"));
  }
  const existClass = await Class.findById(classId);
  if (!existClass) {
    return res.status(404).json(new ApiError("Class not found"));
  }
  const teacherId = req.user?.id;
  if (existClass.teacherId?.toString() !== teacherId) {
    return res.status(403).json(new ApiError("Forbidden, not class teacher"));
  }
  if (!existClass.studentIds.includes(studentObjId)) {
    existClass.studentIds.push(studentObjId);
    await existClass.save();
  }
  return res.status(200).json(
    new ApiResponse({
      studentId,
    }),
  );
};
export const getClass = () => {};
export const myAttendance = () => {};
