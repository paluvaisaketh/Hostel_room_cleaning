import React, { useState } from "react";
import axios from "axios";
import "./styles/AdminAdduser.css";

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    regno: "",
    roomno: "",
    hostelname: "",
    roomtype: "",
    email: "",
  });
  
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    
    try {
      const res = await axios.post("http://localhost:5500/admin/admin-add-user", formData);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="admin-add-user-container">
      <form onSubmit={handleSubmit} className="admin-add-user-form">
        <h1>Add User</h1>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        {Object.keys(formData).map((key) => (
          <div key={key} className="input-group">
            <label>{key.toUpperCase()}:</label>
            <input
              type="text"
              value={formData[key]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            />
          </div>
        ))}
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AdminAddUser;
