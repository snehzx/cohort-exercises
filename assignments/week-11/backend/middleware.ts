import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { config } from "./config";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json("Access Denied!");
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string }; // type assertion;

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("invalid token", error);
    return res.status(403).json({
      message: "invalid token",
    });
  }
};
