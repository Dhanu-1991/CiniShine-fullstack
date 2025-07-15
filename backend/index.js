import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/authRoutes/authRouter.js";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware.js";
import router from "./routes/paymentRoutes/cashfree.js";

const allowedOrigins = [
  "http://localhost:5173",
  "https://cini-shine-fullstack-hru4-git-main-dhanu-1991s-projects.vercel.app"
];

const corsOptions = {
  origin(origin, callback) {
    // if no origin (e.g. mobile apps or curl) or it’s in our whitelist:
    if (!origin || allowedOrigins.includes(origin)) {
      // echo back the requesting origin (not “*”)
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,               // allow Authorization header
  exposedHeaders: ["Authorization"] // if you want to read custom headers
};

const app = express();

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/v1/payments", router);
app.use("/api/v1/auth/authRoutes", authRouter);

// Global error handler
app.use(errorHandlingMiddleware);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
