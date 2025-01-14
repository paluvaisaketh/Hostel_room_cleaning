

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./styles/AdminPanel.css"

const apiUrl = "http://localhost:5500";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove token
    navigate("/"); // Redirect to login page
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
        alert("Failed to fetch bookings.");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
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
        alert("Booking status updated successfully.");
        fetchBookings(); // Refresh bookings
      } else {
        alert("Failed to update booking status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
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
        alert("Booking deleted successfully.");
        fetchBookings(); // Refresh bookings
      } else {
        alert("Failed to delete booking.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <nav class="navbar">
        <div class="logo">Clean Up Crew</div>
        <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
      </nav>
      <div>
        <div className="admin-booking-container">
          <button className="add-user-btn" onClick={() => navigate("/admin-add-user")}>
            Add User
          </button>
          <h2 className="booking-title">All Bookings</h2>
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
      </div>

    </>
  );
};

export default AdminPanel;
