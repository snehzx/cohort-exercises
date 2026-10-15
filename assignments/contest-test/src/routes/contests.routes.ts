import { Router } from "express";
import {
  addMcq,
  createContest,
  dsa,
  getContest,
  getLeaderboard,
  submit,
} from "../controllers/contests.controller";
import { authenticateUser, authoriseUser } from "../middlewares/authenticate";

const router = Router();

router.post("/", authenticateUser, authoriseUser("creator"), createContest);
router.get("/:contestId", authenticateUser, getContest);
router.post(
  "/:contestId/mcq",
  authenticateUser,
  authoriseUser("creator"),
  addMcq,
);
router.post("/:contestId/mcq/:questionId/submit", submit);
router.post("/:contestId/dsa", dsa);
router.get("/contests/:contestId/leaderboard", getLeaderboard);

export default router;
