import Booking from "../models/bookingSchema.js";
import User from "../models/userSchema.js";
import Flight from "../models/flightSchema.js";
import Ticket from "../models/ticketSchema.js";

export const cancelBooking = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.userId;

    // Find the ticket
    const ticket = await Ticket.findOne({ uid: ticketId }).populate('tickets');
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    // Find all bookings associated with this ticket
    const bookingIds = ticket.tickets.map(booking => booking._id);
    const bookings = await Booking.find({ _id: { $in: bookingIds } });

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: "No bookings found" });
    }

    // Get flight and release seats
    const flightId = bookings[0].flight;
    const flight = await Flight.findById(flightId);
    
    if (flight) {
      // Remove booked seats
      const seatsToRelease = bookings.map(booking => booking.seat);
      flight.bookedSeats = flight.bookedSeats.filter(
        seat => !seatsToRelease.includes(seat)
      );
      await flight.save();
    }

    // Delete all bookings
    await Booking.deleteMany({ _id: { $in: bookingIds } });

    // Remove ticket from user's bookings
    const user = await User.findById(userId);
    if (user) {
      user.bookings = user.bookings.filter(
        booking => booking.toString() !== ticket._id.toString()
      );
      await user.save();
    }

    // Delete the ticket
    await Ticket.findByIdAndDelete(ticket._id);

    res.status(200).json({
      success: true,
      message: "Booking cancelled Successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
