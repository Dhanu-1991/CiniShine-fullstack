import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter  from "./routes/authRoutes/authRouter.js"
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware.js";

dotenv.config();
let app = express();
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

//Routes
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

