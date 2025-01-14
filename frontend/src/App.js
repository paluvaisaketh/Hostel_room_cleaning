import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ActiveBookings from "./ActiveBookings";
import AdminAddUser from "./AdminAddUser";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import BookSlot from "./BookSlot";
import Home from "./Home";
import Login from "./Login";
import UserPage from "./UserPage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/active-bookings" element={<ActiveBookings />} />
        <Route path="/admin-add-user" element={<AdminAddUser />} />
        <Route path="/user-page" element={<UserPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/book-slot" element={<BookSlot />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
