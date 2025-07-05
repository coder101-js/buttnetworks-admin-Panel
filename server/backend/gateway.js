import express from "express";
import loginController from "./controller/gateWay/gateWayController.js";
const router = express.Router();


router.post('/gateway',loginController)

export default router;
