import { client } from "../index";

export async function createProject(
  userId: number,
  title: string,
  description: string,
) {
  const project = await client.query(
    `INSERT INTO projects (user_id , title , description) VALUES ($1,$2,$3) RETURNING *`,
    [userId, title, description],
  );

  return project.rows[0];
}

export async function getProjects(userId: number) {
  const project = await client.query(
    `SELECT * FROM projects WHERE user_id=$1`,
    [userId],
  );

  return project.rows;
}
