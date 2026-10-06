import { Router } from "express";
import {
  addStudent,
  createClass,
  getClass,
  myAttendance,
} from "../controllers/class.controller";
import {
  authMiddleware,
  authoriseTeacher,
} from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, authoriseTeacher, createClass);
router.post("/:id/add-student", authMiddleware, authoriseTeacher, addStudent);
router.get(":id/my-attendance", authMiddleware, myAttendance);
router.get("/:id", authMiddleware, getClass);

export default router;
