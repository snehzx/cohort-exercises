import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: String,
    username: String,
    password: String,
  },
  { timestamps: true },
);

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: mongoose.Schema.Types.ObjectId,
});
export const user = mongoose.model("user", userSchema);
export const todo = mongoose.model("todo", todoSchema);
