import { Router } from "express";
import { getProblem, submitSoln } from "../controllers/problems.controller";
import { authenticateUser, authoriseUser } from "../middlewares/authenticate";

const router = Router();

router.post("/:problemId/submit", authenticateUser, submitSoln);
router.get("/:problemId", authenticateUser, getProblem);

export default router;
