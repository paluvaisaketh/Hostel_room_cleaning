import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./styles/Login.css";

const apiUrl = process.env.REACT_APP_API_URL;  // Use environment variable for the API URL

const Login = () => {
  const [credentials, setCredentials] = useState({ regno: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use the environment variable for API URL
      const res = await axios.post(`${apiUrl}/login`, credentials);
      localStorage.setItem("token", res.data.token);
      navigate("/user-page");
    } catch (err) {
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">Clean Up Crew</div>
        <div><button className="btn"><Link to="/">Home</Link></button></div>
      </nav>
      <div className="mainco">
        <div className="login-container">
          <div className="left-container"></div>
          <div className="right-container">
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
              <label htmlFor="regno" className="usernamelabel">
                Registration Number:
              </label>
              <input
                type="text"
                onChange={(e) => setCredentials({ ...credentials, regno: e.target.value })}
                required
              />
              <label htmlFor="password" className="passwordlabel">
                Password:
              </label>
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

export default Login;
