const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./src/routes/auth.routes");
const courseRoutes = require("./src/routes/course.routes");

const app = express();

// middlwares
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://udemy-angular-khaki.vercel.app",
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// mongodb connection
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://rasuljonadxamov1212_db_user:m07TpLIJa2GrW9t0@cluster0.n5aawan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
