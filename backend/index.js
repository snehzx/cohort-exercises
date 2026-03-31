const express = require("express");
const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile("/Users/snehajha/desktop/cohort-exercises/backend/index.html");
});

app.post("/sum", function (req, res) {
  const a = parseInt(req.body.a); // string 1
  const b = parseInt(req.body.b); // string 2

  const sum = a + b;

  res.json({
    ans: sum,
  });
});

app.post("/multiply", function (req, res) {
  const a = parseInt(req.body.a); // string 1
  const b = parseInt(req.body.b); // string 2

  const ans = a * b;

  res.json({
    ans: ans,
  });
});

app.listen(3000, () => console.log("server started"));
