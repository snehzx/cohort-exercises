import { Router } from "express";
import { getProblem, submitSoln } from "../controllers/problems.controller";

const router = Router();

router.post("/:problemId/submit", submitSoln);
router.post("/:problemId", getProblem);

export default router;
