import { Router } from "express";
import {
  getPurchasedCourse,
  coursePurchase,
} from "../controllers/purchase.controllers.ts";
import { authMiddleware, authorise } from "../auth.middleware.ts";

const router = Router();

router.post("/purchases", authMiddleware, authorise("STUDENT"), coursePurchase);
router.get(
  "/users/:id/purchases",
  authMiddleware,
  authorise("STUDENT"),
  getPurchasedCourse,
);

export default router;
