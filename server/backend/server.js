import express from "express";
import loginRouter from "./login.js";
import contactData from "./contactData.js";
// import signupRouter from "./signin.js";
// import { authApiKey } from "./controller/apiAuth/apiKeyAuth.js";
import validateAdminJwt from "./adminValidate.js";
import gateway from "./gateway.js";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import process from "process";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["https://admin.buttnetworks.com"],
    credentials: true, // allow cookies
  })
);
app.use(express.json());
app.use(helmet());
app.use(express.json());
// app.use(authApiKey)

const PORT = process.env.PORT || 3000;

// Add your middlewares here
app.use("/", gateway);
app.use("/login", loginRouter);
app.use("/contact", contactData);
app.use("/validate", validateAdminJwt);
// app.use("/signin", signupRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
