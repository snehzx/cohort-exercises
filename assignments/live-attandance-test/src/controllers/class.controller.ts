import mongoose from "mongoose";
import type { Request, Response } from "express";
import { addStudentSchema, classSchema } from "../validators/schema";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Class } from "../models/class.model";
import { User } from "../models/user.model";
import { Attendance } from "../models/attendance.model";

export const createClass = async (req: Request, res: Response) => {
  const { success, data } = classSchema.safeParse(req.body);
  console.log(data?.className);
  if (!success) {
    return res.status(400).json(new ApiError("Invalid request schema"));
  }
  const { className } = data;
  console.log("here 1");
  const newClass = await Class.create({
    className,
    teacherId: req.user?.id,
    studentIds: [],
  });
  console.log("22");
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
  const isAlreadyEnrolled = existClass.studentIds.some(
    (s) => s.toString() === studentId,
  );
  if (!isAlreadyEnrolled) {
    existClass.studentIds.push(studentObjId);
    await existClass.save();
  }
  return res.status(200).json(
    new ApiResponse({
      studentIds: existClass.studentIds,
    }),
  );
};
export const getClass = async (req: Request, res: Response) => {
  const classId = req.params.id as string;
  const existClass = await Class.findById(classId).populate({
    path: "studentIds",
    select: "_id email name",
  });
  if (!existClass) {
    return res.status(404).json(new ApiError("Class not found"));
  }

  const isEnrolledStudent =
    req.user?.role === "student" &&
    existClass.studentIds.some((s) => s._id.toString() === req.user?.id);

  const isTeacher =
    req.user?.role === "teacher" &&
    existClass.teacherId?.toString() === req.user.id;

  if (!isEnrolledStudent && !isTeacher) {
    return res.status(403).json(new ApiError("Forbidden, not class teacher"));
  }

  return res.status(200).json(
    new ApiResponse({
      _id: existClass._id,
      className: existClass.className,
      students: existClass.studentIds,
      teacherId: existClass.teacherId,
    }),
  );
};
export const myAttendance = async (req: Request, res: Response) => {
  const classId = req.params.id as string;

  const existClass = await Class.findById(classId);

  if (!existClass) {
    return res.status(404).json(new ApiError("Class not found"));
  }
  if (req.user?.role === "teacher") {
    return res
      .status(403)
      .json(new ApiError("Forbidden, student access required"));
  }
  const isEnrolledStudent =
    req.user?.role === "student" &&
    existClass.studentIds.some((s) => s.toString() === req.user?.id);

  if (!isEnrolledStudent) {
    return res
      .status(403)
      .json(new ApiError("Forbidden, not enrolled in class"));
  }
  const att = await Attendance.findOne({ classId });

  return res.status(200).json(
    new ApiResponse({
      classId,
      status: att?.status ?? null,
    }),
  );
};
