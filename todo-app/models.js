const mongoose = require("mongoose");
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
const user = mongoose.model("user", userSchema);
const todo = mongoose.model("todo", todoSchema);
module.exports = {
  user,
  todo,
};
