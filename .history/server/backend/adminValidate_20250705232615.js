import express from "express";
const router = express.Router();
// import { validateAdminJwt } from "./controller/contactApi/contactData.js";
import {}

router.get("/",validateAdminJwt);

export default router;
