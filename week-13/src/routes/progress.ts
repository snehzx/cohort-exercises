import { Router } from "express";
import { getProgress } from "../controllers/progressController.ts";

const router = Router();

router.route("/progress").get(getProgress);

export default router;
