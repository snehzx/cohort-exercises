import { signupSchema, signinSchema } from "../validator/schema";
import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { prisma } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const parsedData = signupSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const { email, name, password, role, phone } = parsedData.data;

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
        password: hashedPassword,
        role,
        phone,
      },
      omit: {
        password: true,
      },
    });
    return res.status(201).json(new ApiResponse(user));
  } catch (err) {
    return res.status(500).json("DB ERROR!");
  }
};
export const signin = async (req: Request, res: Response) => {
  const parsedData = signinSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const { email, password } = parsedData.data;

  const existUser = await prisma.user.findFirst({
    where: { email },
  });
  if (!existUser) {
    return res.status(401).json(new ApiError("INVALID_CREDENTIALS"));
  }
  const validPassword = await bcrypt.compare(password, existUser.password);
  if (!validPassword) {
    return res.status(401).json(new ApiError("INVALID_CREDENTIALS"));
  }
  const token = jwt.sign(
    {
      id: existUser.id,
      role: existUser.role,
    },
    process.env.JWT_SECRET!,
  );

  return res.status(200).json(
    new ApiResponse({
      token,
      user: {
        id: existUser.id,
        name: existUser.name,
        email: existUser.email,
        role: existUser.role,
      },
    }),
  );
};
