import React, { useState } from "react";
import { Link,useNavigate } from 'react-router-dom';
import axios from "axios";
import "./styles/Login.css"

const Login = () => {
  const [credentials, setCredentials] = useState({ regno: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/login", credentials);
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/user-page")
    } catch (err) {
      alert("Error: Invalid credentials");
    }
  };

  return (
    <>
    <nav class="navbar">
    <div class="logo">Clean Up Crew</div>
    <div><button class="btn"><Link to="/">Home</Link></button></div>
    </nav>
    <div className="mainco">
      <div className="login-container">
        <div className="left-container">
          
        </div>
        <div className="right-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="regno" className="usernamelabel">
              Registration Number:
            </label>
            <input
              type="text"
              onChange={(e) =>
                setCredentials({ ...credentials, regno: e.target.value })
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
export default Login;
