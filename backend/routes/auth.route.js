import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// router.post("/refresh-token", refreshToken);
export default router;

//database pIP address (101.2.190.201)
// assword - WMjecCL5maR48Fjf
