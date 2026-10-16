import { Router } from "express";
import {
  addMcq,
  createContest,
  dsa,
  getContest,
  getLeaderboard,
  submitMcq,
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
router.post(
  "/:contestId/mcq/:questionId/submit",
  authenticateUser,
  authoriseUser("contestee"),
  submitMcq,
);
router.post("/:contestId/dsa", authenticateUser, authoriseUser("creator"), dsa);
router.get(
  "/contests/:contestId/leaderboard",
  authenticateUser,
  getLeaderboard,
);

export default router;
