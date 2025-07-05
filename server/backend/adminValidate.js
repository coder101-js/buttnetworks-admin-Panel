import express from "express";
const router = express.Router();
// import { validateAdminJwt } from "./controller/contactApi/contactData.js";
import { verifyToken } from "./controller/contactApi/validateAdminJwt.js";

router.get("/", verifyToken);

export default router;
