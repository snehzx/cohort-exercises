import { Router } from "express";
import { getStudent } from "../controllers/student.controller";
import {
  authMiddleware,
  authoriseTeacher,
} from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, authoriseTeacher, getStudent);

export default router;
