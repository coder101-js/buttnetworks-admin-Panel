import dotenv from "dotenv";
import process from "process";
dotenv.config({ path: "../../.env" });

const validateHcaptcha = async (token) => {
  const secret = process.env.CAPTCHA_SECRET;
  const url = "https://hcaptcha.com/siteverify";

  const params = new URLSearchParams({ secret, response: token });

  const res = await fetch(url, {
    method: "POST",
    body: params,
  });

  const data = await res.json();
  return data.success;
};

export const captchaMiddleware = async (req, res, next) => {
  const token = req.body?.captchaToken;
  
  if (!token) {
    return res.status(400).json({ msg: "Captcha token not found!" });
  }

  try {
    const isValid = await validateHcaptcha(token);
    if (!isValid) {
      return res.status(403).json({ msg: "Wrong Captcha token!" });
    }
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Captcha check failed", error: err.message });
  }
};
