const express = require("express");
const mongoose = require("mongoose");
const { user, todo } = require("./models");
const { authMiddleware } = require("./authMiddleware");
const jwt = require("jsonwebtoken");
const app = express();
mongoose.connect("");
app.listen(3001);
app.use(express.json());
app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existUser = await user.findOne({
    username,
  });
  if (existUser) {
    res.status(403).json({
      message: "this username already exists",
    });
    return;
  }
  const newUser = await user.create({
    username,
    password,
  });
  return res.json({
    id: newUser._id,
  });
});
app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const findUser = await user.findOne({
    username,
    password,
  });
  if (!findUser) {
    return res.status(404).json({
      message: "incorrect credentials",
    });
  }
  const token = jwt.sign(
    {
      userId: findUser._id,
    },
    "1234@$",
  );
  return res.json({ token });
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
