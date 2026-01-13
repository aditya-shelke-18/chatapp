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
    origin: "http://localhost:5173",  // Adjust this if you have a different frontend URL in production
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Serve the React app for all other requests (for client-side routing)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start server and connect to DB
server.listen(PORT, () => {
  console.clear();
  console.log(`Server URL: http://localhost:${PORT}`);
  connectDB();
});
