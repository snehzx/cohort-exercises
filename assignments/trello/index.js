const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");
const { userModel, orgModel } = require("./models");
const app = express();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const port = 5400;
mongoose.connect("");
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

app.use(express.json());
const userSchema = z.object({
  email: z.email(),
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
  try {
    const validData = userSchema.parse(req.body);
    const userExist = await userModel.findOne({
      email: validData.email,
    });
    if (userExist) {
      return res.status(404).json({ message: " this user already exists" });
    }
    const hashedPassword = await bcrypt.hash(validData.password, 10);
    const newUser = await userModel.create({
      email: validData.email,
      password: hashedPassword,
      username: validData.username,
    });
    return res.status(201).json({
      id: newUser._id,
      message: "user created",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "signup error",
      err: err.message,
    });
  }
});
app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const findUser = await userModel.findOne({
    email,
  });
  if (!findUser) {
    return res.status(404).json({
      message: " incorrect credentials",
    });
  }
  const validPassword = await bcrypt.compare(password, findUser.password);
  if (!validPassword) {
    return res.status(411).json({
      message: "wrong password",
    });
  }
  const token = jwt.sign(
    {
      userId: findUser.id,
    },
    "secretkey",
  );
  return res.json({ token });
});
app.post("/organisation", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const newOrg = await orgModel.create({
    title: req.body.title,
    description: req.body.description,
    admin: userId,
    members: [],
  });
  res.json({
    message: "new org created",
    id: newOrg._id,
  });
});
app.post("/add-member-to-organisation", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const orgId = req.body.orgId;
  const memberUserName = req.body.memberUserName;
  const org = await orgModel.findOne({
    _id: orgId,
  });
  if (!org || org.admin.toString() !== userId) {
    res.status(404).json({
      message: "either this org doesnt exist or u are not the admin",
    });
  }
  const memberUser = await userModel.findOne({
    username: memberUserName,
  });
  if (!memberUser) {
    return res.status(404).json({
      message: "memebr dont exist",
    });
  }
  org.members.push(memberUser._id);
  await org.save();
  return res.json({
    message: "new member added",
  });
});
app.post("/boards", (req, res) => {});
app.post("/issues", (req, res) => {});
app.get("/organisation", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const orgId = req.query.orgId;
  const organisation = await orgModel.findOne({
    _id: orgId,
  });

  if (
    !organisation ||
    !organisation.admin ||
    organisation.admin.toString() !== userId
  ) {
    // console.log("admin:", organisation.admin.toString());
    console.log("userId:", userId);
    console.log(typeof organisation.admin);
    console.log(typeof userId);
    return res.status(404).json({
      message: "either this org doesnt exist or u are not the admin",
    });
  }
  const members = await userModel.find({
    _id: organisation.members,
  });
  return res.json({
    organisation: {
      title: organisation.title,
      description: organisation.description,
      members: members.map((m) => {
        return { username: m.username, _id: m._id };
      }),
    },
  });
});
app.get("/boards", (req, res) => {});
app.get("/members", (req, res) => {});
app.put("/issues", (req, res) => {});
app.delete("/members", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const orgId = req.body.orgId;
  const memberUserName = req.body.memberUserName;
  const organisation = await orgModel.findOne({ _id: orgId });
  if (!organisation || organisation.admin.toString() !== userId) {
    return res.status(411).json({
      message: "either this org doesnt exist or u are not the admin",
    });
  }
  const memberUser = await userModel.findOne({ username: memberUserName });
  if (!memberUser) {
    return res.status(411).json({
      message: "no user with this data exists in our db",
    });
  }

  returnres.json({
    message: "member deleted",
  });
});
