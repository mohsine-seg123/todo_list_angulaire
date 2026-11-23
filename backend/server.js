import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:4200",
  }),
);

app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.json({
    message: "To-Do List API is running with PostgreSQL",
  });
});

// Task routes
app.use("/tasks", taskRoutes);

// Check database before starting server
const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("PostgreSQL connection successful");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    process.exit(1);
  }
};

startServer();
