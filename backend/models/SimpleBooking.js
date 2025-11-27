import mongoose from "mongoose";

const SimpleBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    passengerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    departureCity: {
      type: String,
      required: true,
    },
    destinationCity: {
      type: String,
      required: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    passengersCount: {
      type: Number,
      required: true,
      default: 1,
    },
    classType: {
      type: String,
      enum: ["Economy", "Business", "First Class"],
      default: "Economy",
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    // Legacy flag: true = old data to be excluded from UI, false = new booking
    legacy: {
      type: Boolean,
      default: false,
      index: true, // Index for efficient queries
    },
    // Snapshot of user details at booking time (preserves data even if user profile changes)
    userSnapshot: {
      name: String,
      email: String,
      phone: String,
      age: Number,
      profilePic: String,
      // Add any other user fields you want to preserve
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SimpleBooking", SimpleBookingSchema);
