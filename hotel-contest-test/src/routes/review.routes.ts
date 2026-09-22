import { Router } from "express";
import { review } from "../controllers/review.controllers";

const router = Router();

router.post("/", review);

export default router;
