/**
 * Admin Routes for Legacy Data Management
 * 
 * These routes should be protected and accessible only by admins.
 * Add these to your main index.js or create a separate admin routes file.
 */

import express from "express";
import { authenticate } from "../auth/verifyToken.js";
import SimpleBooking from "../models/SimpleBooking.js";
import User from "../models/userSchema.js";

const router = express.Router();

/**
 * POST /api/admin/migrate-legacy
 * Mark all existing bookings as legacy
 * Requires: Admin authentication
 */
router.post("/migrate-legacy", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Count bookings without legacy flag
    const bookingsToMigrate = await SimpleBooking.countDocuments({
      legacy: { $exists: false },
    });

    if (bookingsToMigrate === 0) {
      return res.status(200).json({
        success: true,
        message: "No bookings to migrate. All bookings already have legacy flag.",
        migrated: 0,
      });
    }

    // Update all bookings without legacy flag
    const result = await SimpleBooking.updateMany(
      { legacy: { $exists: false } },
      { $set: { legacy: true } }
    );

    res.status(200).json({
      success: true,
      message: `Successfully marked ${result.modifiedCount} bookings as legacy`,
      migrated: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error migrating legacy bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to migrate legacy bookings",
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/booking-stats
 * Get statistics about legacy vs active bookings
 * Requires: Admin authentication
 */
router.get("/booking-stats", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const totalBookings = await SimpleBooking.countDocuments({});
    const legacyBookings = await SimpleBooking.countDocuments({ legacy: true });
    const activeBookings = await SimpleBooking.countDocuments({ legacy: { $ne: true } });
    const cancelledBookings = await SimpleBooking.countDocuments({ status: "cancelled" });
    const activeAndNotLegacy = await SimpleBooking.countDocuments({
      legacy: { $ne: true },
      status: "active",
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalBookings,
        legacy: legacyBookings,
        nonLegacy: activeBookings,
        cancelled: cancelledBookings,
        activeNonLegacy: activeAndNotLegacy,
      },
    });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking statistics",
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/revert-legacy/:id
 * Remove legacy flag from a specific booking (restore to active)
 * Requires: Admin authentication
 */
router.post("/revert-legacy/:id", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const booking = await SimpleBooking.findByIdAndUpdate(
      req.params.id,
      { $set: { legacy: false } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking restored from legacy status",
      booking,
    });
  } catch (error) {
    console.error("Error reverting legacy status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to revert legacy status",
      error: error.message,
    });
  }
});

export default router;
