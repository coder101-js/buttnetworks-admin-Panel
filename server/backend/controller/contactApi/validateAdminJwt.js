import jwt from "jsonwebtoken";
import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "../login/.env" });

export const verifyToken = (req, res, next) => {
  const token = req.cookies.sessionId; // 👈 get token from cookie
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    console.log(process.env.JWT_TOKEN)
    const decoded = jwt.verify(token, process.env.JWT_TOKEN); // 🔑 verify token
    req.user = decoded; // 🧠 store user info for later
    next(); // ✅ move on to the actual route
  } catch (err) {
    console.error("JWT Validation Error:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
