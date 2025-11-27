import SimpleBooking from "../models/SimpleBooking.js";
import User from "../models/userSchema.js";

// Create new booking with user snapshot
export const createSimpleBooking = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const {
      passengerName,
      email,
      phone,
      departureCity,
      destinationCity,
      travelDate,
      passengersCount,
      classType,
    } = req.body;

    // Validation
    if (
      !passengerName ||
      !email ||
      !phone ||
      !departureCity ||
      !destinationCity ||
      !travelDate ||
      !passengersCount
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Fetch user details for snapshot
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create userSnapshot from current user profile
    const userSnapshot = {
      name: user.name,
      email: user.email,
      phone: user.phone || phone, // Use form phone if user phone not in profile
      age: user.age,
      profilePic: user.profilePic,
    };

    // Create booking with legacy: false (new booking)
    const newBooking = new SimpleBooking({
      userId,
      passengerName,
      email,
      phone,
      departureCity,
      destinationCity,
      travelDate,
      passengersCount,
      classType: classType || "Economy",
      status: "active",
      legacy: false, // Explicitly mark as new booking
      userSnapshot, // Save user details snapshot
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Flight booked successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book flight",
      error: error.message,
    });
  }
};

// Get user's bookings (excludes legacy data)
export const getMyFlights = async (req, res) => {
  try {
    const userId = req.userId;

    // Query: exclude legacy bookings, only show user's bookings
    // Option to show only active OR all (active + cancelled)
    const showAll = req.query.showAll === 'true';
    
    const query = {
      userId,
      legacy: { $ne: true }, // Exclude legacy data (old DB entries)
    };

    // If not showing all, only show active bookings
    if (!showAll) {
      query.status = "active";
    }

    const bookings = await SimpleBooking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Cancel booking
export const cancelFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const booking = await SimpleBooking.findOne({ _id: id, userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};
