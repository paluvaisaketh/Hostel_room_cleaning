import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/UserPage.css"

const apiUrl = process.env.REACT_APP_API_URL;

const UserPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const showUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    showUserDetails();
  }, []);

  return (
    <>
      <div>
        <nav class="navbar1">
          <div class="logo1">Clean Up Crew</div>
          <button class="btn1" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
      <div>
        {user ? (
          <>
            <div className="container">
              <div className="text-content">
                <div>
                  Welcome To Our Website,
                  <p>{user.name} (Register No: {user.regno})</p>
                  <div class="booking-rules">
                    <h2>Booking Slot Rules</h2>
                    <ul>
                      <li><strong>Eligibility:</strong> Only registered users can book a slot.</li>
                      <li><strong>Slot Availability:</strong> Slots are on a first-come, first-served basis.</li>
                      <li><strong>Booking Limit:</strong> One slot per user per day.</li>
                      <li><strong>Cancellation:</strong> Cancel 24 hours before the slot to avoid penalties.</li>
                      <li><strong>No-Show:</strong> Failing to show up may lead to penalties.</li>
                    </ul>
                  </div>

                </div>
                <div className="buttons">
                  <button onClick={() => navigate("/book-slot")}>Book a Slot</button>
                  <button onClick={() => navigate("/active-bookings")}>Active Bookings</button>
                </div>
              </div>
              <div className="image-container"></div> 
            </div>
          </>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </>
  );
};

export default UserPage;
