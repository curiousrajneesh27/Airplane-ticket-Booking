import express from "express";
import { authenticate } from "../auth/verifyToken.js";
import {
  createSimpleBooking,
  getMyFlights,
  cancelFlight,
} from "../controller/simpleBookingController.js";

const router = express.Router();

router.post("/book-flight", authenticate, createSimpleBooking);
router.get("/my-flights", authenticate, getMyFlights);
router.delete("/cancel-flight/:id", authenticate, cancelFlight);

export default router;
