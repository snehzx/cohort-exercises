import { Router } from "express";

const router = Router();

router.route("/signup").post();
router.route("/signin").post();
router.route("/").put();
router.route("/bulk").get();

export default router;
