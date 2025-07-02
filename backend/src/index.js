import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./auth/auth.js";
import { aiRouter } from "./Ai/main.js";
import { connectDB } from "./db/db.js";

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://mind-mend-ai-therapist.vercel.app",
    // origin:"http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);

connectDB()
  .then(() => {
    app.listen(3001, () => {
      console.log("server running on port 3001");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB. Server not started.");
  });
