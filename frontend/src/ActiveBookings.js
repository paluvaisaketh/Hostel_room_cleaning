import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ActiveBookings.css";

const apiUrl = "http://localhost:5500";

const ActiveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const fetchActiveBookings = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/active-bookings`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setErrorMessage("Failed to fetch active bookings.");
      }
    } catch (error) {
      setErrorMessage("Error fetching bookings. Please try again.");
      console.error("Error fetching bookings:", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/deletebooking/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setSuccessMessage("Booking deleted successfully.");
        fetchActiveBookings(); // Refresh bookings
      } else {
        setErrorMessage("Failed to delete booking.");
      }
    } catch (error) {
      setErrorMessage("Error deleting booking. Please try again.");
      console.error("Error deleting booking:", error);
    }
  };

  useEffect(() => {
    fetchActiveBookings();
  }, []);

  return (
    <>
      <div>
        <nav className="navbar1">
          <div className="logo">Clean Up Crew</div>
          <button onClick={() => navigate("/user-page")} className="btn">Back to Home</button>
        </nav>
      </div>

      <h1 className="page-title">Active Bookings</h1>

      {/* Success & Error Messages */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h2 className="sub-title">Your Bookings</h2>

      {bookings.length > 0 ? (
        <ul className="booking-list">
          {bookings.map((booking) => (
            <li key={booking._id} className="booking-item">
              <div className="booking-details">
                <strong>Area:</strong> {booking.carea} <br />
                <strong>Date:</strong> {new Date(booking.ndate).toLocaleDateString()} <br />
                <strong>Time:</strong> {booking.time} <br />
                <strong>Status:</strong> {booking.status}
              </div>
              <button
                className="delete-button"
                onClick={() => deleteBooking(booking._id)}
                disabled={booking.status !== "requested"}
              >
                {booking.status === "requested" ? "Delete" : "Cannot Delete"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-bookings">No active bookings found.</p>
      )}
    </>
  );
};

export default ActiveBookings;
