import { Router } from "express";
import {
  getCourse,
  getCourseWithLesson,
  createCourse,
  deleteCourse,
  updateCourse,
  getStats,
} from "../controllers/course.controllers.ts";
import { authMiddleware, authorise } from "../auth.middleware.ts";

const router = Router();
router
  .route("/")
  .get(getCourse)
  .post(authMiddleware, authorise("INSTRUCTOR"), createCourse);
router
  .route("/:id")
  .get(getCourseWithLesson)
  .patch(authMiddleware, authorise("INSTRUCTOR"), updateCourse)
  .delete(authMiddleware, authorise("INSTRUCTOR"), deleteCourse);
router.get("/:id/stats", authorise("INSTRUCTOR"), getStats);
export default router;
