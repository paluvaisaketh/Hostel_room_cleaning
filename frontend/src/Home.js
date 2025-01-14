import React from "react";
import { Link } from "react-router-dom";
import "./styles/Home.css"
const Home = () => (
  <div>
    <nav class="navbar">
    <div class="logo">Clean Up Crew</div>
    <div class="nav-buttons">
      <button class="btn"><Link to="/login">Student Login</Link></button>
      <button class="btn"><Link to="/admin-login">Admin Login</Link></button>
    </div>
  </nav>
  <div class="content">
  <div class="left">
    <h1>Welcome to Clean Up Crew</h1>
    <p>Welcome to our Hostel Room Cleaning Service! We ensure a clean, safe, and comfortable environment for all residents. Book your cleaning appointment easily through our website. Thank you for choosing us!</p>
  </div>
  <div class="right">
    
  </div>

</div>

</div>
);

export default Home;
