import express from "express";
import { prisma } from "./db.ts";

const app = express();
app.listen(3000, () => {
  console.log("server started");
});

app.use(express.json());

import userRouter from "./routes/user.routes.ts";
import courseRouter from "./routes/course.routes.ts";
import lessonRouter from "./routes/lesson.routes.ts";
import purchaseRouter from "./routes/purchase.routes.ts";
import { authMiddleware } from "./auth.middleware.ts";

app.use("/auth", userRouter);
app.use("/courses", courseRouter);
app.use("/", lessonRouter);
app.use("/", purchaseRouter);

app.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.user!.id,
      role: req.user!.role,
    },
  });

  return res.json({
    id: req.user!.id,
    role: req.user!.role,
    email: user?.email,
    name: user?.name,
  });
});
