const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    regno: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },  
    roomno: { type: Number, required: true },
    roomtype: { type: String, required: true },  
    hostelname: { type: String, required: true },
    password: { type: String, default: null },  
});

module.exports = mongoose.model("User", userSchema);

