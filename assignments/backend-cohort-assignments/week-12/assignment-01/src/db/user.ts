import { client } from "..";

/*
 * Should insert into the users table
 * Should return the User object
 * {
 *   username: string,
 *   password: string,
 *   name: string
 * }
 */

export async function createUser(
  username: string,
  password: string,
  name: string,
) {
  const query = `INSERT INTO users (username , password , name) VALUES ($1 , $2 , $3) RETURNING *`;
  const values = [username, password, name];
  const user = await client.query(query, values);

  return user.rows[0];
}
/*
 * Should return the User object
 * {
 *   username: string,
 *   password: string,
 *   name: string
 * }
 */

export async function getUser(userId: number) {
  const id = await client.query(`SELECT * FROM users WHERE id=($1)`, [userId]);

  return id.rows[0];
}
