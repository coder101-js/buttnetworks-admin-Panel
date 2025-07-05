import express from "express";
const router = express.Router();
// import { validateAdminJwt } from "./controller/contactApi/contactData.js";
import { verifyToken } from "./controller/contactApi/validateAdminJwt";

router.get("/", verifyToken);

export default router;
