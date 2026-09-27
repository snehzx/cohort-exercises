import { Router } from "express";
import { attendance } from "../controllers/attendance.controller";

const router = Router();

router.post("/start", attendance);

export default router;
