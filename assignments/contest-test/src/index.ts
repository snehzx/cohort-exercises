import express from "express";

const app = express();

app.use(express.json());

import authRouter from "./routes/auth.routes";
import contestsRouter from "./routes/contests.routes";
import problemsRouter from "./routes/problems.routes";

app.use("/api/auth", authRouter);
app.use("/api/problems", problemsRouter);
app.use("/api/contests", contestsRouter);

app.listen(process.env.PORT, () => {
  console.log("server started");
});
