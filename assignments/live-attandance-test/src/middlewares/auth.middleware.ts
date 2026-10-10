import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        role: "student" | "teacher";
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers?.authorization;
  if (!token) {
    return res
      .status(401)
      .json(new ApiError("Unauthorized, token missing or invalid"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiError("Unauthorized, token missing or invalid"));
  }
};

export const authoriseTeacher = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "teacher") {
    return res
      .status(403)
      .json(new ApiError("Forbidden, teacher access required"));
  }
  next();
};
