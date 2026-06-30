import { Router } from "express";

const router = Router();

router.route("/balance").get();
router.route("/transfer").post();

export default router;
