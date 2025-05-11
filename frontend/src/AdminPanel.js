import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AdminPanel.css";

const apiUrl = process.env.REACT_APP_API_URL;

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    } else {
      fetchBookings();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${apiUrl}/all-bookings`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setError("Failed to fetch bookings.");
      }
    } catch (error) {
      setError("Error fetching bookings: " + error.message);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${apiUrl}/update-status/${bookingId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMessage("Booking status updated successfully.");
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
      } else {
        setError("Failed to update booking status.");
      }
    } catch (error) {
      setError("Error updating status: " + error.message);
    }
  };

  const deleteBooking = async (bookingId) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${apiUrl}/delete-booking/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMessage("Booking deleted successfully.");
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
      } else {
        setError("Failed to delete booking.");
      }
    } catch (error) {
      setError("Error deleting booking: " + error.message);
    }
  };

  return (
    <>
      <nav className="navbar1">
        <div className="logo1">Clean Up Crew</div>
        <button className="btn1" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="admin-booking-container">
        <button className="add-user-btn" onClick={() => navigate("/admin-add-user")}>
          Add User
        </button>
        <h2 className="booking-title">All Bookings</h2>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <table className="booking-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Hostel</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.userId.name}</td>
                <td>{booking.userId.hostelname}</td>
                <td>{new Date(booking.ndate).toLocaleDateString()}</td>
                <td>{booking.time}</td>
                <td>
                  <select
                    className="status-dropdown"
                    value={booking.status}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                  >
                    <option value="requested">Requested</option>
                    <option value="requestaccepted">Request Accepted</option>
                    <option value="cleaningcompleted">Cleaning Completed</option>
                  </select>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => deleteBooking(booking._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPanel;
