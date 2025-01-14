import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/BookSlot.css";
const apiUrl = "http://localhost:5500";

const BookSlot = () => {
  const [ndate, setNdate] = useState("");
  const [carea, setCarea] = useState("");
  const [time, setTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const navigate = useNavigate();

  const fetchAvailableSlots = async (selectedDate) => {
    try {
      const response = await fetch(`${apiUrl}/available-slots?ndate=${selectedDate}`);
      const bookedSlots = await response.json();
      setAvailableSlots(bookedSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setNdate(selectedDate);
    fetchAvailableSlots(selectedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Date validation
    const selectedDate = new Date(ndate);
    const today = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    if (selectedDate <= today) {
      alert("Please select a future date.");
      return;
    }

    if (selectedDate > endOfWeek) {
      alert("Please select a date within this week.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in to book a slot.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/book-slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ndate, carea, time }),
      });

      if (response.ok) {
        alert("Slot booked successfully!");
        navigate("/user-page"); // Redirect to home page
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error booking slot:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
    <div>
        <nav class="navbar1">
          <div class="logo">Clean Up Crew</div>
          <button onClick={() => navigate("/user-page")} class="btn">Back to Home</button>
        </nav>
      </div>
    <div className="book-slot-container">
  <h1 className="page-title">Book a Slot</h1>
  <form onSubmit={handleSubmit} className="slot-form">
    <label className="form-label">
      Select Date:   
      <input
        type="date"
        value={ndate}
        onChange={handleDateChange}
        required
        className="input-field"
      />
    </label>
    <br />
    <label className="form-label">
      Care Area:
      <input
        type="text"
        value={carea}
        onChange={(e) => setCarea(e.target.value)}
        placeholder="Care Area"
        required
        className="input-field"
      />
    </label>
    <br />
    <label className="form-label">
      Select Time:
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        className="select-field"
      >
        <option value="" disabled>
          Select Time
        </option>
        {["9", "10", "11", "12", "13", "14", "15", "16", "17"].map((slot) => (
          <option
            key={slot}
            value={slot}
            disabled={availableSlots.some((s) => s.time === slot && s.count >= 2)}
          >
            {slot}:00 {slot < 12 ? "AM" : "PM"}
          </option>
        ))}
      </select>
    </label>
    <br />
    <div className="rag"><button type="submit" className="submit-button">Book Slot</button></div>
  </form>
</div>
</>
  );
};

export default BookSlot;
