import { client } from "../index";

export async function createUser(
  username: string,
  password: string,
  name: string,
) {
  const query = `INSERT INTO users (username , password , name) VALUES  ($1,$2,$3) RETURNING * `;
  const values = [username, password, name];

  const user = await client.query(query, values);
  return user.rows[0];
}

export async function getUser(id: number) {
  const query = ` SELECT * FROM users WHERE id=$1 `;
  const values = [id];

  const user = await client.query(query, values);
  return user.rows[0];
}
