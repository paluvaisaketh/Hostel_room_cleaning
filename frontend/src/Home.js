import React from "react";
import { Link } from "react-router-dom";
import "./styles/Home.css";

const Home = () => (
  <div>
    <nav className="navbar">
      <div className="logo">Clean Up Crew</div>
      <div className="nav-buttons">
        <Link to="/login" className="btn">Student Login</Link>
        <Link to="/admin-login" className="btn">Admin Login</Link>
      </div>
    </nav>
    
    <div className="content">
      <div className="left">
        <h1>Welcome to Clean Up Crew</h1>
        <p>
          Welcome to our Hostel Room Cleaning Service! We ensure a clean, safe, 
          and comfortable environment for all residents. Book your cleaning 
          appointment easily through our website. Thank you for choosing us!
        </p>
      </div>
      <div className="right">
        {/* Optionally add an image or illustration here */}
      </div>
    </div>
  </div>
);

export default Home;
