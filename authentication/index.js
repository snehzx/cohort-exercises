// requesly
// ben awad tweet cookie
const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");

const app = express();
app.use(express.json());

const notes = [];
const users = [
  {
    username: "xyz",
    password: "1234",
  },
];

app.post("/signup", function (req, res) {
  const username = req.body.username; // xyz
  const password = req.body.password;
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(403).json({
      message: "User with this username already exists",
    });
  }

  users.push({
    username: username,
    password: password,
  });

  res.json({
    message: "You have signed up",
  });
});

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const userExists = users.find(
    (user) => user.username === username && user.password === password,
  );

  if (!userExists) {
    res.status(403).json({
      message: "Incorrect credentials",
    });
    return;
  }

  // json web tokens
  const token = jwt.sign(
    {
      username: username,
    },
    "xyz123",
  );

  res.json({
    token: token,
  });
});

// POST - Create a note -- AUTHENTICATED ENDPOINT
app.post("/notes", authMiddleware, function (req, res) {
  const username = req.username;
  const note = req.body.note;
  notes.push({ note, username });

  res.json({
    message: "Done!",
  });
});

// GET - get all my notes -- AUTHENTICATED ENDPOINT
app.get("/notes", authMiddleware, function (req, res) {
  const username = req.username;
  const userNotes = notes.filter((note) => note.username === username);

  res.json({
    notes: userNotes,
  });
});

app.get("/", function (req, res) {
  res.sendFile(
    "/Users/snehajha/desktop/cohort-exercises/authentication/frontend/index.html",
  );
});

app.get("/signup", function (req, res) {
  res.sendFile(
    "/Users/snehajha/desktop/cohort-exercises/authentication/frontend/signup.html",
  );
});

app.get("/signin", function (req, res) {
  res.sendFile(
    "/Users/snehajha/desktop/cohort-exercises/authentication/frontend/signin.html",
  );
});

app.listen(3000);
