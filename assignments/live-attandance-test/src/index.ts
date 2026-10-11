import connectDb from "./db";
import { server, app } from "./server.ts";

connectDb()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log("server started");
    });
  })
  .catch(() => {
    console.log("connection failed");
  });

import authRouter from "./routes/auth.route.ts";
import classRouter from "./routes/class.route.ts";
import studentRouter from "./routes/student.route.ts";
import attRouter from "./routes/attendance.route.ts";
import "./ws/index.ts";

app.use("/auth", authRouter);
app.use("/class", classRouter);
app.use("/attendance", attRouter);
app.use("/students", studentRouter);
