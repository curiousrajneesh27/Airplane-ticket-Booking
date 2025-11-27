/**
 * Migration Script: Mark Legacy Bookings
 * 
 * This script marks all existing bookings in the database as legacy.
 * Legacy bookings will NOT be displayed in the new UI.
 * 
 * Usage:
 * 1. Run once before deploying new booking feature: npm run migrate-legacy
 * 2. Or use admin route: POST /api/admin/migrate-legacy (requires admin authentication)
 * 
 * What it does:
 * - Updates ALL existing simplebookings with legacy: true
 * - Optionally can filter by date: only mark bookings before a certain timestamp
 * - Preserves all other booking data
 * 
 * Safety:
 * - Does not delete any data
 * - Only adds/updates the 'legacy' flag
 * - Can be reversed if needed
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import SimpleBooking from "../models/SimpleBooking.js";

dotenv.config();

const IMPLEMENTATION_DATE = new Date("2025-11-27T00:00:00.000Z"); // Adjust this date

const markLegacyBookings = async () => {
  try {
    console.log("🚀 Starting Legacy Booking Migration...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB\n");

    // Option 1: Mark ALL existing bookings as legacy
    console.log("📊 Checking for bookings to migrate...");
    
    const bookingsToMigrate = await SimpleBooking.countDocuments({
      legacy: { $exists: false }, // Bookings without legacy field
    });

    console.log(`Found ${bookingsToMigrate} bookings without legacy flag\n`);

    if (bookingsToMigrate === 0) {
      console.log("✅ No bookings to migrate. All bookings already have legacy flag.");
      process.exit(0);
    }

    // Option A: Mark ALL existing bookings as legacy
    const resultAll = await SimpleBooking.updateMany(
      { legacy: { $exists: false } }, // Only update docs without legacy field
      { $set: { legacy: true } }
    );

    console.log(`✅ Marked ${resultAll.modifiedCount} bookings as legacy (Option A: All existing)\n`);

    // Option B: Mark only bookings created before implementation date
    // Uncomment this and comment Option A if you want date-based filtering
    /*
    const resultByDate = await SimpleBooking.updateMany(
      {
        $and: [
          { createdAt: { $lt: IMPLEMENTATION_DATE } },
          { $or: [{ legacy: { $exists: false } }, { legacy: false }] }
        ]
      },
      { $set: { legacy: true } }
    );
    console.log(`✅ Marked ${resultByDate.modifiedCount} bookings as legacy (Option B: Before ${IMPLEMENTATION_DATE})\n`);
    */

    // Verify results
    const legacyCount = await SimpleBooking.countDocuments({ legacy: true });
    const activeCount = await SimpleBooking.countDocuments({ legacy: { $ne: true } });

    console.log("📈 Final Status:");
    console.log(`   Legacy bookings: ${legacyCount}`);
    console.log(`   Active bookings: ${activeCount}`);
    console.log("\n✅ Migration completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

// Run migration
markLegacyBookings();
