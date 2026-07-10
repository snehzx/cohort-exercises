import { Router } from "express";
import { postLesson, getLesson } from "../controllers/lesson.controllers.ts";
import { authMiddleware, authorise } from "../auth.middleware.ts";
const router = Router();

router.post("/lessons", authMiddleware, authorise("INSTRUCTOR"), postLesson);
router.get("/courses/:courseId/lessons", getLesson);

export default router;
