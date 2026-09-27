import { Router } from "express";
import {
  addStudent,
  createClass,
  getClass,
  myAttendance,
} from "../controllers/class.controller";

const router = Router();

router.post("/", createClass);
router.post("/:id/add-student", addStudent);
router.get(":id/my-attendance", myAttendance);
router.get("/:id", getClass);

export default router;
