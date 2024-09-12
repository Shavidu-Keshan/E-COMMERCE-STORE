import express from "express";
import dotenv from "dotenv"//import .env

dotenv.config(); //cal the config function

const app = express();

const PORT = process.env.PORT || 5000;

app.use ("/api/auth", authRoutes)


app.listen(5000, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
