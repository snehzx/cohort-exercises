import mongoose from "mongoose";
import type { Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/apiResponse";

export const getStudent = async (req: Request, res: Response) => {
  const students = await User.find({
    role: "student",
  }).select("-password");

  return res.status(200).json(new ApiResponse(students));
};
