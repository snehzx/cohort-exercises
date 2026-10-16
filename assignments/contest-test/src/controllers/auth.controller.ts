import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../validators/schema";
import { ApiError } from "../utils/apiError";
import prisma from "../db";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/apiResponse";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const { success, data } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const { email, role, name, password } = data;

  const existUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existUser) {
    return res.status(400).json(new ApiError("EMAIL_ALREADY_EXISTS"));
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });
    return res.status(201).json(new ApiResponse(user));
  } catch (error) {
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { success, data } = loginSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const { email, password } = data;

  const existUser = await prisma.user.findFirst({
    where: { email },
  });
  if (!existUser) {
    return res.status(401).json(new ApiError("INVALID_CREDENTIALS"));
  }

  const verifyPassword = await bcrypt.compare(password, existUser.password);

  if (!verifyPassword) {
    return res.status(401).json(new ApiError("INVALID_CREDENTIALS"));
  }
  try {
    const token = jwt.sign(
      {
        id: existUser.id,
        role: existUser.role,
      },
      process.env.JWT_SECRET!,
    );
    return res.status(200).json(new ApiResponse({ token }));
  } catch (error) {
    return;
  }
};
