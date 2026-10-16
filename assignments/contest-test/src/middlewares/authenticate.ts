import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        role: "creator" | "contestee";
      };
    }
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json(new ApiError("UNAUTHORIZED"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "creator" | "contestee";
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(401).json(new ApiError("UNAUTHORIZED"));
  }
};

export const authoriseUser =
  (role: string) => (req: Request, res: Response, next: NextFunction) => {
    if (role !== req.user?.role) {
      return res.status(403).json(new ApiError("FORBIDDEN"));
    }
    next();
  };
