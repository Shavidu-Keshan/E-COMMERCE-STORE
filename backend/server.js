import express from "express";
import dotenv from "dotenv"; // import .env
import authRoutes from "./routes/auth.route.js"; 

dotenv.config(); // Call the config function

const app = express();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

