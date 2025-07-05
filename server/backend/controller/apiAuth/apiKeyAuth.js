import dotenv from "dotenv";
import process from "process";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
export const authApiKey = (req, res, next) => {
  const skipRoutes = ["/gateway"]; // whatever your middleware routes are
  if (skipRoutes.includes(req.path)) return next();
  const serverKey = process.env.API_KEY;

  // Look for the key in body, headers, or query params
  const clientKey = req.headers["x-api-key"] || req.query.apiKey;
  if (!clientKey) {
    return res.status(403).json({ msg: "API key missing 🚫" });
  }

  if (clientKey !== serverKey) {
    return res.status(403).json({ msg: "Invalid API key 🔐" });
  }
  next();
};
