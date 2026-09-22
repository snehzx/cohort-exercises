import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        role: "customer" | "owner";
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(404).json({
      message: "token is missing",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "customer" | "owner";
    };
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(403).json({
      message: "forbidden",
    });
  }
};

export const authorise =
  (allowedRole: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return res.status(401).json(new ApiError("UNAUTHORIZED"));
    }
    if (!allowedRole.includes(req.user.role)) {
      return res.status(403).json(new ApiError("FORBIDDEN"));
    }
  };
