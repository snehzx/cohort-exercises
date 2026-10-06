import { Router } from "express";
import { getStudent } from "../controllers/student.controller";
import { authMiddleware, authorise } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, authorise("TEACHER"), getStudent);

export default router;
