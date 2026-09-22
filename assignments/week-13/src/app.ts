import express from "express";

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("server started");
});

import submitRouter from "./routes/submit.ts";
import progressRouter from "./routes/progress.ts";

app.use("/api/v1", submitRouter);
app.use("/api/v1", progressRouter);
