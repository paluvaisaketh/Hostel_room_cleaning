import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./styles/AdminLogin.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:5500/admin-login", credentials);
      localStorage.setItem("adminToken", res.data.token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/admin-panel"), 1500);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">Clean Up Crew</div>
        <div><button className="btn"><Link to="/">Home</Link></button></div>
      </nav>
      <div className="mainco1">
        <div className="login-container1">
          <div className="left-container1"></div>
          <div className="right-container1">
            <h2>Admin Login</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
              <label htmlFor="username" className="usernamelabel">Username:</label>
              <input
                type="text"
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
              <label htmlFor="password" className="passwordlabel">Password:</label>
              <input
                type="password"
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <div className="ll">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;