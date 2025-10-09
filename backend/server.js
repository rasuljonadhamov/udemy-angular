const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./src/routes/auth.routes");
const courseRoutes = require("./src/routes/course.routes");

const app = express();

// middlwares
app.use(cors({
  origin: ['http://localhost:4200', 'https://udemy-angular.vercel.app'],
  credentials: true
}));
app.use(express.json());

// mongodb connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/online-courses"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/reviews", require("./src/routes/review.routes"));

// health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
