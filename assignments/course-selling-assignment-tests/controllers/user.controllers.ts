import type { Request, Response } from "express";
import { LoginSchema, SignupSchema } from "../schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../db.ts";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const parsedData = SignupSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "invalid or missing input",
      error: z.flattenError(parsedData.error).fieldErrors,
    });
  }

  const { email, name, password, role } = parsedData.data;

  const existUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existUser) {
    return res.status(400).json({
      message: "user already exists",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
      omit: {
        password: true,
      },
    });

    return res.status(200).json({
      message: "signup successfull",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "failed to register" });
  }
};
export const login = async (req: Request, res: Response) => {
  const parsedData = LoginSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json("invalid or missing input");
  }

  const { email, password } = parsedData.data;

  const existUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!existUser) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  const validPassword = await bcrypt.compare(password, existUser.password);

  if (!validPassword) {
    return res.status(400).json({
      message: "invalid passwod",
    });
  }

  const token = jwt.sign(
    {
      id: existUser.id,
      role: existUser.role,
    },
    process.env.JWT_SECRET!,
  );

  return res.status(200).json({
    message: "login successfull",
    token,
  });
};
