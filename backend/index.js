import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes/authRouter.js";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware.js";
import router from "./routes/paymentRoutes/cashfree.js";
import cors from "cors";
dotenv.config();
let app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://cini-shine-fullstack-hru4-git-main-dhanu-1991s-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());


//Routes
app.use("/api/v1/payments", router);
app.use("/api/v1/auth/authRoutes",authRouter)
app.use(errorHandlingMiddleware);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.error("Database connection failed:", err);
    process.exit(1);
});

