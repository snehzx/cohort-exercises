import { Router } from "express";
import { submitProblem } from "../controllers/submitController";

const router = Router();

router.route("/submit").post(submitProblem);

export default router;
