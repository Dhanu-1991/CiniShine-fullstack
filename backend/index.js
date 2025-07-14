// Handle uncaught exceptions globally
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught exception:", err);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes/authRouter.js";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware.js";
import router from "./routes/paymentRoutes/cashfree.js";

dotenv.config();

const app = express();

// ✅ CORS config
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://cini-shine-fullstack-hru4-git-main-dhanu-1991s-projects.vercel.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// ❌ Removed app.options("*") to prevent crash in Express v5+
/* 
⚠️ You DO NOT need this anymore:
app.options("*", cors(corsOptions));
*/

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/v1/payments", router);
app.use("/api/v1/auth/authRoutes", authRouter);

// ✅ Error handling middleware (must be last)
app.use(errorHandlingMiddleware);

// ✅ Connect to DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
