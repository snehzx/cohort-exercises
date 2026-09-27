import { Router } from "express";
import { getStudent } from "../controllers/student.controller";

const router = Router();

router.get("/", getStudent);

export default router;
