import express from "express";
import dotenv from "dotenv"; // import .env
import authRoutes from "./routes/auth.route.js"; 
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config(); // Call the config function

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());//allow you to parse body of the requestt
app.use(cookieParser());//allow you to parse cookie of the requestt

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

