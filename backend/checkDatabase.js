import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userSchema.js";
import Flight from "./models/flightSchema.js";
import Airline from "./models/airlineSchema.js";
import SimpleBooking from "./models/SimpleBooking.js";
import Booking from "./models/bookingSchema.js";
import Ticket from "./models/ticketSchema.js";

dotenv.config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected\n");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log("=================================");
    console.log("📊 DATABASE COLLECTIONS");
    console.log("=================================");
    collections.forEach((c) => console.log(`  - ${c.name}`));

    console.log("\n=================================");
    console.log("📈 DOCUMENT COUNTS");
    console.log("=================================");

    const users = await User.countDocuments();
    const flights = await Flight.countDocuments();
    const airlines = await Airline.countDocuments();
    const bookings = await Booking.countDocuments();
    const simpleBookings = await SimpleBooking.countDocuments();
    const tickets = await Ticket.countDocuments();

    console.log(`  Users:          ${users}`);
    console.log(`  Flights:        ${flights}`);
    console.log(`  Airlines:       ${airlines}`);
    console.log(`  Bookings (Old): ${bookings}`);
    console.log(`  SimpleBookings: ${simpleBookings}`);
    console.log(`  Tickets:        ${tickets}`);

    console.log("\n=================================");
    console.log("🎫 RECENT SIMPLE BOOKINGS");
    console.log("=================================");

    const recentBookings = await SimpleBooking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");

    if (recentBookings.length === 0) {
      console.log("  No bookings found");
    } else {
      recentBookings.forEach((booking, index) => {
        console.log(`\n  📌 Booking ${index + 1}:`);
        console.log(`     ID: ${booking._id}`);
        console.log(`     Passenger: ${booking.passengerName}`);
        console.log(`     Route: ${booking.departureCity} → ${booking.destinationCity}`);
        console.log(`     Date: ${booking.travelDate.toLocaleDateString()}`);
        console.log(`     Passengers: ${booking.passengersCount}`);
        console.log(`     Class: ${booking.classType}`);
        console.log(`     Status: ${booking.status === 'active' ? '✅ Active' : '❌ Cancelled'}`);
        console.log(`     User: ${booking.userId?.name} (${booking.userId?.email})`);
      });
    }

    console.log("\n=================================");
    console.log("👥 SAMPLE USERS");
    console.log("=================================");

    const sampleUsers = await User.find({}).limit(5).select("name email isAdmin");

    sampleUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} - ${user.email} ${user.isAdmin ? '(Admin)' : ''}`);
    });

    console.log("\n=================================");
    console.log("✈️ SAMPLE FLIGHTS");
    console.log("=================================");

    const sampleFlights = await Flight.find({})
      .limit(5)
      .populate("airline", "name");

    sampleFlights.forEach((flight, index) => {
      console.log(`  ${index + 1}. ${flight.departureCity} → ${flight.arrivalCity}`);
      console.log(`     Airline: ${flight.airline?.name || 'N/A'}`);
      console.log(`     Price: ₹${flight.economyClassPrice}`);
    });

    console.log("\n=================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkDatabase();
