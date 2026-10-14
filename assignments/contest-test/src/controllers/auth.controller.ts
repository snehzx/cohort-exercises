import type { Request, Response } from "express";
import { signupSchema } from "../validators/schema";
import { ApiError } from "../utils/apiError";

export const signup = async (req: Request, res: Response) => {
  const { success, data } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const { email, role, name } = data;
};
export const login = (req: Request, res: Response) => {};
