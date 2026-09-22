import { signup, signin } from "../controllers/auth.controllers";
import { Router } from "express";

const router = Router();

router.post("/signup", signup);
router.post("/login", signin);

export default router;
