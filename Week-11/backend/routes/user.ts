import { Router } from "express";
import { signupSchema, signinSchema, updateSchema } from ".";
import { User, Account } from "../db";
import bcrypt from "bcrypt";
import { config } from "../config";
import { verifyJwt } from "../middleware";
import { z } from "zod";
import jwt from "jsonwebtoken";

const router = Router();

router.route("/signup").post(async (req, res) => {
  const { data, success, error } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "invalid or missing input",
      error: z.flattenError(error).fieldErrors,
    });
  }

  const existUser = await User.findOne({
    $or: [{ username: data.username }, { email: data.email }],
  });

  if (existUser) {
    return res.status(404).json("user already exist");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    password: hashedPassword,
  });

  const balance = Math.floor(Math.random() * 1000);

  const account = await Account.create({
    userId: user._id,
    balance,
  });

  const newUser = await User.findById(user._id).select("-password");

  return res.status(201).json({
    message: "user created",
    newUser,
    balance: account.balance,
  });
});
router.route("/signin").post(async (req, res) => {
  const parsedData = signinSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "invalid input",
    });
  }

  const { email, password } = parsedData.data;

  const existUser = await User.findOne({ email });

  if (!existUser) {
    return res.status(401).json("email or password is wrong");
  }

  const validPassword = await bcrypt.compare(password, existUser.password);

  if (!validPassword) {
    return res.status(401).json("email or password is wrong");
  }

  const token = jwt.sign(
    {
      id: existUser._id,
    },
    config.JWT_SECRET,
  );

  return res.status(200).json({
    message: "signin done",
    token,
  });
});
router.route("/").put(verifyJwt, async (req, res) => {
  const parsedData = updateSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(403).json("invalid input");
  }
  type updateData = z.infer<typeof updateSchema>;
  const updates: updateData = {};

  if (parsedData.data.firstName) updates.firstName = parsedData.data.firstName;
  if (parsedData.data.lastName) updates.lastName = parsedData.data.lastName;
  if (parsedData.data.username) updates.username = parsedData.data.username;

  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: updates },
    {
      new: true,
    },
  ).select("-password");

  if (!user) {
    return res.status(404).json("user not found");
  }

  return res.status(200).json({
    message: "user updated",
    user,
  });
});

router.route("/bulk").get(verifyJwt, async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      { firstName: { $regex: filter, $options: "i" } },
      { lastName: { $regex: filter, $options: "i" } },
      { username: { $regex: filter, $options: "i" } },
    ],
  }).select("_id username , firstName , lastName");

  return res.status(200).json({
    message: "user fetched successfully",
    users,
  });
});

export default router;
