import { Router } from "express";
import {
  addMcq,
  createContest,
  dsa,
  getContest,
  getLeaderboard,
  submit,
} from "../controllers/contests.controller";

const router = Router();

router.post("/", createContest);
router.get("/:contestId", getContest);
router.post("/:contestId/mcq", addMcq);
router.post("/:contestId/mcq/:questionId/submit", submit);
router.post("/:contestId/dsa", dsa);
router.get("/contests/:contestId/leaderboard", getLeaderboard);

export default router;
