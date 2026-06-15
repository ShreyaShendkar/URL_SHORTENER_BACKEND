import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();

const app = express();

// CORS configuration with credentials support
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

// Public redirect route (not under /api)
app.get("/:shortId", (req, res, next) => {
  // If it looks like an API route, skip to next
  if (req.path.startsWith("/api")) {
    return next();
  }
  // Otherwise, import and use the redirect controller
  import("./controllers/urlController.js").then(({ redirectUrl }) => {
    redirectUrl(req, res);
  });
});

const PORT = process.env.PORT || 5000;
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(
        `Server is running successfully on port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });
