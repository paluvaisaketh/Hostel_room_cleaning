const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ndate: { type: Date, required: true },
    carea: { type: String, required: true },
    time: { type: String, required: true },
    roomno: { type: Number, required: true },
    hostelname: { type: String, required: true },
    status: {
        type: String,
        enum: ["requested", "requestaccepted", "cleaningcompleted"],
        default: "requested"
    }
});

const bookingModel = mongoose.model("Booking", bookingSchema);
module.exports = bookingModel;
