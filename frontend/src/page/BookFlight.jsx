import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKENDURL } from "../Config/Config";
import { authContext } from "../context/authContext";
import { toast } from "react-toastify";

const BookFlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(authContext);

  const [loading, setLoading] = useState(false);
  const [destinationData, setDestinationData] = useState(null);

  const [formData, setFormData] = useState({
    passengerName: "",
    email: user?.email || "",
    phone: "",
    departureCity: "",
    destinationCity: "",
    travelDate: "",
    passengersCount: 1,
    classType: "Economy",
  });

  useEffect(() => {
    // Load destination data if ID is passed
    if (id) {
      // Import destination data
      import("../assets/data/FlightData").then((module) => {
        const destinations = module.flightLocationData;
        const dest = destinations.find((d) => d.id === parseInt(id));
        
        if (dest) {
          setDestinationData(dest);
          setFormData((prev) => ({
            ...prev,
            destinationCity: dest.location,
          }));
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.passengerName ||
      !formData.email ||
      !formData.phone ||
      !formData.departureCity ||
      !formData.destinationCity ||
      !formData.travelDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to book a flight");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${BACKENDURL}/api/book-flight`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Flight booked successfully! 🎉");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message || "Failed to book flight. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-[30px] md:px-[60px] py-10">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Your Flight</h1>
        <p className="text-gray-600 mb-8">
          {destinationData
            ? `Booking flight to ${destinationData.location}, ${destinationData.country}`
            : "Fill in your travel details"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
        >
          {/* Passenger Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passenger Name *
            </label>
            <input
              type="text"
              name="passengerName"
              value={formData.passengerName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Cities Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Departure City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From (Departure City) *
              </label>
              <input
                type="text"
                name="departureCity"
                value={formData.departureCity}
                onChange={handleChange}
                placeholder="Delhi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Destination City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To (Destination City) *
              </label>
              <input
                type="text"
                name="destinationCity"
                value={formData.destinationCity}
                onChange={handleChange}
                placeholder="Mumbai"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Travel Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Travel Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date *
              </label>
              <input
                type="date"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Passengers Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passengers *
              </label>
              <input
                type="number"
                name="passengersCount"
                value={formData.passengersCount}
                onChange={handleChange}
                min="1"
                max="9"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Class Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Type *
              </label>
              <select
                name="classType"
                value={formData.classType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Booking..." : "Book Flight Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFlight;
