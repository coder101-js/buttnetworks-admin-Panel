import express from "express";
const router = express.Router();
import { getData } from "./controller/contactApi/contactData.js";

router.get("/",validate);

export default router;
