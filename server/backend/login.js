import express from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import {
  handleEmail,
  handlePassword,
  handleEmailAuthToken,
  validateEmailToken,
  authPasswordToken,
  
} from "./controller/login/loginController.js";
// import { captchaMiddleware } from "./controller/signUp/verifyCaptcha.js";

import dotenv from "dotenv";
import process from "process";
dotenv.config();

const router = express.Router();

mongoose.connect(process.env.MONGO_URI);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { msg: "Too many login attempts!" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/email", loginLimiter, handleEmail);
router.get("/token", handleEmailAuthToken);
router.post("/auth", validateEmailToken);
router.post("/password", loginLimiter,authPasswordToken, handlePassword); 

export default router;
