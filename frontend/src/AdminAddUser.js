import React, { useState } from "react";
import axios from "axios";
import "./styles/AdminAdduser.css"
const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    regno: "",
    roomno: "",
    hostelname: "",
    roomtype: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/admin/admin-add-user", formData);
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add User</h1>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>{key.toUpperCase()}:</label>
          <input
            type="text"
            value={formData[key]}
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
          />
        </div>
      ))}
      <button type="submit">Add User</button>
    </form>
  );
};

export default AdminAddUser;
