import { Router } from "express";
import { attendance } from "../controllers/attendance.controller";
import {
  authMiddleware,
  authoriseTeacher,
} from "../middlewares/auth.middleware";

const router = Router();

router.post("/start", authMiddleware, authoriseTeacher, attendance);

export default router;
