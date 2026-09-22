import { Router } from "express";
import {
  createHotel,
  createRoom,
  getHotels,
  getHotel,
} from "../controllers/hotel.controllers";
import { authMiddleware, authorise } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getHotels);
router.post("/", authMiddleware, authorise("owner"), createHotel);
router.get("/:hotelId", getHotel);
router.post("/:hotelId/rooms", createRoom);

export default router;
