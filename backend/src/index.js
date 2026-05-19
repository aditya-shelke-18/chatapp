import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socker.js";  // This should be fine, assuming 'app' and 'server' are defined properly in the socket.js

dotenv.config();

const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

// Express middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
    credentials: true,
  })
);

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Local dev server
if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`Server URL: http://localhost:${PORT}`);
  });
}

export default app;
