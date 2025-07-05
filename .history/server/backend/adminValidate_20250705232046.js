import express from "express";
const router = express.Router();
import { getData } from "./controller/contactApi/contactData.js";

router.post("/",getData);

export default router;
