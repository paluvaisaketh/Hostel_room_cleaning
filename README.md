# Hostel Cleaning Website

## Overview
The **Hostel Cleaning Website** is a platform designed for students to book cleaning slots for their hostel rooms. The system ensures an efficient booking process, prevents duplicate bookings for shared rooms, and operates within predefined time slots.

## Features
- **User Authentication**: Students can log in using their **registration number** and password.
- **Slot Booking**: Users can book cleaning slots for two days in the current week (Sunday-Saturday).
- **Time Restriction**: Bookings are available between **9:00 AM and 6:00 PM**.
- **Conflict Handling**: For shared rooms, the system prevents multiple bookings at the same time.
- **User Dashboard**:
  - View personal details.
  - Check room details.
  - See booked slots and availability.
- **Admin Panel** (Optional):
  - Manage users.
  - Track bookings.
  - Oversee cleaning schedules.

## Technologies Used
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based authentication
- **Deployment**: Hosted on a cloud platform (Render)

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB
- Git

### Steps to Run Locally
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/hostel-cleaning-website.git
   cd hostel-cleaning-website
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. **Run the backend server:**
   ```sh
   npm start
   ```
5. **Run the frontend:**
   ```sh
   cd frontend
   npm start
   ```

## Usage
1. **Login** using registration number and password.
2. **View available slots** for the week.
3. **Select a slot** and confirm your booking.
4. **Check your booking history** in the dashboard.
5. **For shared rooms**, ensure no other roommate has already booked a slot.

## Future Enhancements
- Add **notifications** for upcoming cleaning schedules.
- Implement **admin analytics** for monitoring cleaning frequency.
- Enable **feedback system** for cleaning quality evaluation.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any inquiries or contributions, feel free to reach out to **paluvaibhargavsaketh@gmail.com**.

