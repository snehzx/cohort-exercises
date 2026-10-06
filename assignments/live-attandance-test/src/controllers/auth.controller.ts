import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../validators/schema";
import { ApiError } from "../utils/apiError";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/apiResponse";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const { success, data, error } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("Invalid request schema"));
  }
  const { name, email, role, password } = data;

  const existUser = await User.findOne({
    email,
  });
  if (existUser) {
    return res.status(400).json(new ApiError("Email already exists"));
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      name,
      password: hashedPassword,
      email,
      role,
    });

    return res.status(201).json(
      new ApiResponse({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError("server error"));
  }
};
export const login = async (req: Request, res: Response) => {
  const { success, data, error } = loginSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("Invalid request schema"));
  }
  const { email, password } = data;
  const existUser = await User.findOne({ email });
  if (!existUser) {
    return res.status(400).json(new ApiError("Invalid email or password"));
  }
  const validPassword = await bcrypt.compare(password, existUser.password);
  if (!validPassword) {
    return res.status(400).json(new ApiError("Invalid email or password"));
  }
  try {
    const token = jwt.sign(
      {
        id: existUser._id,
        role: existUser.role,
      },
      process.env.JWT_SECRET!,
    );
    return res.status(200).json(new ApiResponse({ token }));
  } catch (error) {
    return res.status(500).json(new ApiError("server error"));
  }
};
export const me = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const user = await User.findById(userId).select("-password");

  return res.status(200).json(new ApiResponse(user));
};
