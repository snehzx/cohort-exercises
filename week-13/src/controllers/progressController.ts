import type { Request, Response } from "express";
import { pool } from "../config/db.ts";

export const getProgress = async (req: Request, res: Response) => {
  const { user_id } = req.query;

  const getCourseProgress = await pool.query(
    `
    SELECT p.completion_percentage , c.title FROM progress p JOIN courses c ON p.course_id = c.id WHERE p.user_id = $1 
    `,
    [user_id],
  );
  const result = getCourseProgress.rows[0];
  console.log(result);

  return res.status(200).json({
    message: "all course progress fetched completed successfully",
    result,
  });
};
