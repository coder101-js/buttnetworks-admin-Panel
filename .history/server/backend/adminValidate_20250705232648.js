import express from "express";
const router = express.Router();
// import { validateAdminJwt } from "./controller/contactApi/contactData.js";
import {verifyToken} from '../backend/'

router.get("/",validateAdminJwt);

export default router;
