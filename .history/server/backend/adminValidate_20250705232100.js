import express from "express";
const router = express.Router();
import { getData } from "./controller/contactApi/contactData.js";

router.get("/",validateAdminJwt);

export default router;
