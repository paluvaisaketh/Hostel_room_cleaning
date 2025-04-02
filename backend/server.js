const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const userModel = require("./models/userModel"); 
const bookingModel = require("./models/bookingModel");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); 

mongoose.connect("mongodb://localhost:27017/HostelCleaning", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: "paluvaibhargavsaketh@gmail.com", 
        pass: "yddo cads jbhc uamg", 
    },
});

app.post("/admin/admin-add-user", async (req, res) => {
    try {
        const { name, regno, roomno, hostelname, roomtype, email } = req.body;

        const existingUser = await userModel.findOne({
            $or: [{ regno }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new userModel({
            name,
            regno,
            roomno,
            hostelname,
            roomtype,
            email,
            password: null, 
        });

        await newUser.save();

        await transporter.sendMail({
            from: '"Hostel Cleaning Service" paluvaibhargavsaketh@gmail.com', 
            to: email, 
            subject: "Welcome to the Hostel Cleaning Service - Your Account Details", 
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: blue;">Welcome, ${name}!</h2>
                    <p>This mail is for giving credentials to our college official Hostel Room cleaning service Website. Below are your account details:</p>
                    <ul style="list-style-type: none; padding: 0;">
                        <li><strong>Registration Number:</strong> ${regno}</li>
                        <li><strong>Room Number:</strong> ${roomno}</li>
                        <li><strong>Hostel Name:</strong> ${hostelname}</li>
                        <li><strong>Room Type:</strong> ${roomtype}</li>
                        <li><strong>Email:</strong> ${email}</li>
                    </ul>
                    <p>Please contact us if any of these account details are wrong.</p>
                    <p><strong>Your temporary password:</strong> <span style="color: orange;">${randomPassword}</span></p>
                    <p>Please log in using this password.</p>
                    <p>Feel free to contact us if you have any questions.</p>
                    <p style="margin-top: 20px;">Best Regards,<br>Hostel Cleaning Service Team</p>
                </div>
            `,
        });
        
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        await userModel.updateOne({ regno }, { password: hashedPassword });

        res.status(201).json({ message: "User created successfully and password sent to email." });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


app.post("/login", async (req, res) => {
    try {
        const { regno, password } = req.body;
        const user = await userModel.findOne({ regno });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, "SECRET_KEY", { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(403);
    jwt.verify(token, "SECRET_KEY", (err, user) => {
        if (err) return res.sendStatus(403);
        req.userId = user.userId;
        next();
    });
};

app.get("/user", verifyToken, async (req, res) => {
    const user = await userModel.findById(req.userId).select("-password");
    res.json(user);
});

app.post("/book-slot", verifyToken, async (req, res) => {
    try {
        const { ndate, carea, time } = req.body;
        const userId = req.userId;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { roomno, hostelname, roomtype } = user;
        const today = new Date();

        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        let bookingCount;

        if (roomtype === "Shared") {
            bookingCount = await bookingModel.countDocuments({
                roomno,
                hostelname,
                ndate: { $gte: startOfWeek, $lte: endOfWeek },
            });
        } else {
            bookingCount = await bookingModel.countDocuments({
                userId,
                ndate: { $gte: startOfWeek, $lte: endOfWeek },
            });
        }

        if (bookingCount >= 2) {
            return res.status(400).json({ message: "This shared room has reached its booking limit for the week." });
        }

        const totalSlotsForDay = await bookingModel.countDocuments({ ndate });
        if (totalSlotsForDay >= 25) {
            return res.status(400).json({ message: "All slots for this day are booked." });
        }

        const timeSlotCount = await bookingModel.countDocuments({ ndate, time });
        if (timeSlotCount >= 2) {
            return res.status(400).json({ message: `The ${time} slot is fully booked.` });
        }

        const newBooking = new bookingModel({
            userId,
            ndate,
            carea,
            time,
            roomno,
            hostelname,
        });

        await newBooking.save();
        res.status(201).json({ message: "Slot booked successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

app.get("/available-slots", async (req, res) => {
    try {
        const { ndate } = req.query;

        const slots = await bookingModel.aggregate([
            { $match: { ndate: new Date(ndate) } },
            { $group: { _id: "$time", count: { $sum: 1 } } },
            { $project: { time: "$_id", count: 1, _id: 0 } }
        ]);

        res.status(200).json(slots);
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ message: "Server error." });
    }
});

app.get("/active-bookings", verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        const { roomno, hostelname } = user;
        const bookings = await bookingModel.find({ roomno, hostelname, ndate: { $gte: new Date() } });
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching active bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.delete("/deletebooking/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await bookingModel.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }
        if (booking.status !== "requested") {
            return res.status(403).json({ message: "Cannot delete booking, status is not 'requested'." });
        }

        await bookingModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Booking deleted successfully." });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Server Error" });
    }
});

const SECRET_KEY = "SECRET_KEY";

app.post("/admin-login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "password123") {
        const token = jwt.sign({ role: "admin" }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

app.get("/all-bookings", verifyAdminToken, async (req, res) => {
    const bookings = await bookingModel.find().populate("userId");
    res.json(bookings);
});


app.delete("/delete-booking/:id", verifyAdminToken, async (req, res) => {
    await bookingModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
});


app.patch("/update-status/:id", verifyAdminToken, async (req, res) => {
    const { status } = req.body;
    try {
        await bookingModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ message: "Booking status updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error updating booking status." });
    }
});



function verifyAdminToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err || decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });
        next();
    });
}

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
