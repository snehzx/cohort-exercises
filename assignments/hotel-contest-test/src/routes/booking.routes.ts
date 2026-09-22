import { Router } from "express";
import {
  cancelBooking,
  getBooking,
  booking,
} from "../controllers/booking.controllers";

const router = Router();

router.post("/", booking);
router.get("/", getBooking);
router.put("/:bookingId/cancel", cancelBooking);

export default router;
