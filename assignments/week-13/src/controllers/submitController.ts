import type { Request, Response } from "express";
import { pool } from "../config/db.ts";

//submit a problem and update progress (transactional)
export const submitProblem = async (req: Request, res: Response) => {
  const { user_id, problem_id } = req.body;

  if (!user_id || !problem_id) {
    return res.status(400).json("invalid creds");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO submissions (user_id , problem_id ) VALUES ($1, $2)`,
      [user_id, problem_id],
    );

    const course = await client.query(
      `SELECT course_id FROM problems where id=$1 `,
      [problem_id],
    );

    const course_id = course.rows[0].course_id;

    const totalProblem = await client.query(
      `SELECT COUNT(*) AS total_problems FROM problems WHERE course_id=$1`,
      [course_id],
    );

    const total_problems = Number(totalProblem.rows[0].total_problems);

    const solvedProblems = await client.query(
      `SELECT COUNT(DISTINCT s.problem_id) AS solved_problems FROM submissions s JOIN problems p ON s.problem_id = p.id WHERE  s.user_id = $1 AND p.course_id = $2 `,
      [user_id, course_id],
    );

    const solved_problems = Number(solvedProblems.rows[0].solved_problems);

    const percentage = (solved_problems / total_problems) * 100;

    await client.query(
      ` INSERT INTO progress (user_id, course_id, completion_percentage)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, course_id)
        DO UPDATE
        SET completion_percentage = EXCLUDED.completion_percentage`,
      [user_id, course_id, percentage],
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "problem submitted successfully",
      completionPercentage: percentage,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
