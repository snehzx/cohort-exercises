import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const pool = new Pool({
  connectionString: process.env.NEON,
});

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  //very bad way to do sql using pg - vulnerable to sql injection
  //   const response = await pool.query(
  //     `INSERT INTO users (username , email , password) VALUES ('${username}' , '${email}'  , '${password}') RETURNING id`,
  //   );
  const response = await pool.query(
    `INSERT INTO users (username , email , password) VALUES ($1, $2, $3) RETURNING id;`,
    [username, email, password],
  );
  return res.status(200).json({
    id: response.rows[0].id,
    message: "signup done",
  });
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const response = await pool.query(
    `SELECT * FROM users WHERE email=$1 AND password=$2`,
    [email, password],
  );

  if (!response.rows[0]) {
    return res.status(400).json({
      message: "incorrect credentials",
    });
  }

  return res.status(200).json({
    message: "signin done",
  });
});

async function getUserDetails(user) {
  try {
    const query = `SELECT users.id ,users.email, users.password ,todos.id ,todos.title 
      FROM users JOIN todos on users.id = todos.user_id
      WHERE users.id=$1`;

    const result = await pool.query(query, [user]);
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Error during fetching user and todos:", error);
    throw error;
  }
}
getUserDetails(2);

app.listen(3000, () => {
  console.log("server started");
});
