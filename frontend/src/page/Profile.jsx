import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BACKENDURL } from "../Config/Config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary";
import { authContext } from "../context/authContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { dispatch } = useContext(authContext);

  const [userData, setUserData] = useState({});
  const [tickets, setTickets] = useState([]);
  const [simpleBookings, setSimpleBookings] = useState([]);
  const [showAllBookings, setShowAllBookings] = useState(false); // Toggle to show cancelled
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch user data and old tickets
    axios
      .get(BACKENDURL + "/api/v1/auth/getUser", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserData(response.data.user);
        setTickets(response.data.tickets);
        setUserName(response.data.user.name);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    // Fetch simple bookings (excludes legacy data automatically)
    fetchSimpleBookings(token);
  }, [navigate]);

  // Separate function to fetch bookings (can be called to refresh)
  const fetchSimpleBookings = (token) => {
    const params = showAllBookings ? "?showAll=true" : "";
    axios
      .get(BACKENDURL + "/api/my-flights" + params, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.success) {
          setSimpleBookings(response.data.bookings);
        }
      })
      .catch((error) => {
        console.error("Error fetching simple bookings:", error);
      });
  };

  // Refresh bookings when toggle changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchSimpleBookings(token);
    }
  }, [showAllBookings]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload image to Cloudinary
        const imageData = await uploadImageToCloudinary(file);
        setProfilePic(imageData.secure_url); // Set profile picture URL
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token === null) {
        navigate("/login");
      } else {
        let updatedData = { name: userName };

        if (profilePic) {
          const imageData = await uploadImageToCloudinary(profilePic);
          updatedData.profilePic = imageData.secure_url;
        }

        const response = await axios.put(
          BACKENDURL + "/api/v1/auth/updateUser",
          updatedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Profile updated successfully");
        console.log("Profile updated successfully:", response.data);
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelBooking = async (ticketId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${BACKENDURL}/api/v1/bookings/cancel/${ticketId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Booking cancelled successfully");
        // Refresh the tickets list
        setTickets(tickets.filter(ticket => ticket.uid !== ticketId));
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const handleCancelSimpleBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this flight booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${BACKENDURL}/api/cancel-flight/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Flight booking cancelled successfully");
        // Refresh the simple bookings list
        setSimpleBookings(simpleBookings.filter(booking => booking._id !== bookingId));
      }
    } catch (error) {
      console.error("Error cancelling flight booking:", error);
      toast.error("Failed to cancel flight booking");
    }
  };

  return (
    <div className="px-[30px] md:px-[30px]">
      <div className="max-w-[800px] mx-auto">
        <h1 className="mt-5 text-2xl">Profile</h1>
        <div className="my-5 w-[100px] h-[100px] rounded-full overflow-hidden relative">
          <div className="w-full h-full object-cover absolute flex justify-center items-center bg-black/40 opacity-0 hover:opacity-100 cursor-pointer">
            <label htmlFor="profile-pic-upload">
              <TbEdit className="text-white text-[40px] cursor-pointer" />
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>
          {profilePic ? (
            <img src={profilePic} alt="" />
          ) : (
            <img src={userData.profilePic} alt="" />
          )}
        </div>

        <div>
          <div className="flex gap-2 justify-start items-center">
            <p>User Name: </p>
            <input
              type="text"
              value={userName}
              className="outline-none"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <p className="mt-2">User Email: {userData.email}</p>
        </div>

        <div className="flex gap-2 justify-start items-center">
          <button
            className="bg-blue-300 text-black mt-3 px-8 py-3 rounded-xl hover:bg-blue-400 transition duration-200"
            onClick={handleProfileUpdate}
          >
            Update Profile
          </button>
          <button
            className="bg-red-300 text-black mt-3 px-8 py-3 rounded-xl hover:bg-red-400 transition duration-200"
            onClick={() => {
              handleLogout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        {/* Simple Bookings Section */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">My Flight Bookings</h2>
            <button
              onClick={() => setShowAllBookings(!showAllBookings)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition duration-200"
            >
              {showAllBookings ? "Show Active Only" : "Show All (Including Cancelled)"}
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            {showAllBookings 
              ? "Showing all bookings (active and cancelled)" 
              : "Showing only active bookings"}
          </p>

          {simpleBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {simpleBookings.map((booking) => (
                <div
                  key={booking._id}
                  className={`border-2 rounded-lg p-5 hover:shadow-lg transition duration-200 ${
                    booking.status === 'cancelled' 
                      ? 'border-red-300 bg-red-50 opacity-75' 
                      : 'border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{booking.passengerName}</h3>
                      {/* Show user snapshot if available */}
                      {booking.userSnapshot && (
                        <p className="text-xs text-gray-500">
                          Booked as: {booking.userSnapshot.name}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {booking.status === 'active' ? '✅ Active' : '❌ Cancelled'}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Route:</span>
                      <span>{booking.departureCity}</span>
                      <span>→</span>
                      <span className="font-semibold">{booking.destinationCity}</span>
                    </p>
                    <p><strong>Date:</strong> {new Date(booking.travelDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</p>
                    <p><strong>Passengers:</strong> {booking.passengersCount}</p>
                    <p><strong>Class:</strong> {booking.classType}</p>
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Phone:</strong> {booking.phone}</p>
                    {booking.createdAt && (
                      <p className="text-xs text-gray-500 pt-2">
                        Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {booking.status === 'active' && (
                    <button
                      onClick={() => handleCancelSimpleBooking(booking._id)}
                      className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 font-medium"
                    >
                      Cancel Flight
                    </button>
                  )}
                  {booking.status === 'cancelled' && (
                    <div className="mt-4 text-center text-red-600 text-sm font-medium">
                      This booking has been cancelled
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">
                {showAllBookings 
                  ? "No flight bookings found" 
                  : "No active flight bookings. Book your first flight!"}
              </p>
              {!showAllBookings && (
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Browse Destinations
                </button>
              )}
            </div>
          )}
        </div>

        {/* Old Tickets Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">My Tickets (Old System)</h2>
        {tickets.length > 0 ? (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="py-3">Ticket ID</th>
                <th className="py-3">View</th>
                <th className="py-3">Cancel</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-b">
                  <td className="text-center py-3">{ticket.uid}</td>
                  <td className="text-center py-3">
                    <Link
                      to={`/ticket/${ticket.uid}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      View Ticket
                    </Link>
                  </td>
                  <td className="text-center py-3">
                    <button
                      onClick={() => handleCancelBooking(ticket.uid)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Cancel Booking
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No tickets found</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
