const express = require("express");
const mongoose = require("mongoose");
const { user, todo } = require("./models");
const { authMiddleware } = require("./authMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const app = express();
mongoose.connect("");
app.listen(3001);
app.use(express.json());
const userSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  username: z.string().min(1),
});
app.post("/signup", async (req, res) => {
  const { data, success, error } = userSchema.safeParse(req.body);
  if (!success) {
    return res.status(404).json({
      message: "incorrect input",
      error: JSON.parse(error),
    });
  }

  const existUser = await user.findOne({
    email: data.email,
  });
  if (existUser) {
    res.status(403).json({
      message: "this username already exists",
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await user.create({
    email: data.email,
    username: data.username,
    password: hashedPassword,
  });
  return res.json({
    id: newUser._id,
  });
});
app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const findUser = await user.findOne({
    email,
  });
  if (!findUser) {
    return res.status(404).json({
      message: "incorrect credentials",
    });
  }
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (!passwordMatch) {
    return res.status(404).json({
      message: "incorrect credentials",
    });
  }
  const token = jwt.sign(
    {
      userId: findUser.id,
    },
    "1234@$",
  );
  return res.json({
    token,
  });
});
app.post("/todos", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const title = req.body.title;
  const description = req.body.description;
  await todo.create({
    title,
    description,
    userId,
  });
  return res.json({
    userId,
    message: "todo created",
  });
});
app.delete("/todos/:todoId", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.todoId;
  const doesUserOwnTodo = await todo.findOneAndDelete({
    _id: todoId,
    userId: userId,
  });
  if (!doesUserOwnTodo) {
    return res.status(411).json({
      message: "either this todo doesnt exist or u are not the owner",
    });
  }

  return res.json({
    message: "todo deleted",
  });
});

app.get("/todos", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const userTodos = await todo.find({
    userId,
  });
  return res.json({
    userTodos,
  });
});
