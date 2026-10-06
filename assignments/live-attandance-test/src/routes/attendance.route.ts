import { Router } from "express";
import { attendance } from "../controllers/attendance.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/start", authMiddleware, attendance);

export default router;
