import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./styles/AdminLogin.css"
import Home from "./Home";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/admin-login", credentials);
      localStorage.setItem("adminToken", res.data.token);
      alert("Login successful!");
      navigate("/admin-panel");  
    } catch (err) {
      if (err.response) {
        alert(`Error: ${err.response.data.message}`);
      } else if (err.request) {
        alert("Error: No response from server");
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <>
    <nav class="navbar">
    <div class="logo">Clean Up Crew</div>
    <div><button class="btn"><Link to="/">Home</Link></button></div>
    </nav>
    <div className="mainco1">
      <div className="login-container1">
        <div className="left-container1">
         
        </div>
        <div className="right-container1">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="username" className="usernamelabel">
              Username:
            </label>
            <input
              type="text"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />

            <label htmlFor="password" className="passwordlabel">
              Password:
            </label>
            <input
              type="password"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
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
