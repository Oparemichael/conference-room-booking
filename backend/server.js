const express = require("express");
const cors = require("cors");

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// ROUTES
// ======================
const roomsRoute = require("./routes/rooms");
const bookingsRoute = require("./routes/bookings");
const authRoutes = require("./routes/auth");

// API endpoints
app.use("/api/rooms", roomsRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/auth", authRoutes);

// ======================
// HEALTH CHECK ROUTE
// ======================
app.get("/", (req, res) => {
  res.json({
    message: "Conference Room API Running",
  });
});

// ======================
// GLOBAL ERROR HANDLER (IMPORTANT)
// ======================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    message: "Internal server error",
  });
});

// ======================
// START SERVER
// ======================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});