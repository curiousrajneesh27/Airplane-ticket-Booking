import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";

import { getCheckoutSession } from "../controller/bookingController.js";
import { cancelBooking } from "../controller/cancelBookingController.js";

const router = express.Router();

router.post("/checkout-session/:flightId", authenticate, getCheckoutSession);
router.delete("/cancel/:ticketId", authenticate, cancelBooking);

export default router;
