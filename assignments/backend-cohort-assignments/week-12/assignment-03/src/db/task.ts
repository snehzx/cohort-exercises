import { client } from "../index";

export async function createTask(
  projectId: number,
  title: string,
  dueDate: string,
) {
  const query = `INSERT INTO tasks (project_id , title , due_date) VALUES ($1 , $2, $3) RETURNING *`;
  const values = [projectId, title, dueDate];

  const res = await client.query(query, values);
  return res.rows[0];
}

export async function updateTask(taskId: number, completed: boolean) {
  const query = `UPDATE tasks SET completed = $1 WHERE id=$2 RETURNING * `;
  const values = [completed, taskId];
  const res = await client.query(query, values);
  return res.rows[0];
}

export async function getTasks(projectId: number) {
  const res = await client.query(`SELECT * FROM tasks WHERE id=$1`, [
    projectId,
  ]);

  return res.rows;
}
