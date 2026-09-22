import express from "express";

const app = express();

app.use(express.json());

import authRouter from "./routes/auth.routes.ts";
import hotelRouter from "./routes/hotel.routes.ts";
import bookingRouter from "./routes/booking.routes.ts";
import reviewRouter from "./routes/review.routes.ts";

app.use("/api/auth", authRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);

app.listen(3000, () => {
  console.log("server started");
});
