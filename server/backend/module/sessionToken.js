import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hash = async (password, salt = 12) => {
  const SALT = await bcrypt.genSalt(salt);
  const hashedPassword = await bcrypt.hash(password, SALT);
  return hashedPassword;
};
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex"); // 64-char secure string
};
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
const hashEmail = (email) => {
  return crypto
    .createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
};
export const isEmailMatch = (inputEmail, storedHash) => {
  const hashedInput = hashEmail(inputEmail.trim().toLowerCase());
  return hashedInput === storedHash;
};


export const emailToken = async (email) => {
  const rawToken = await generateToken();
  const hashedToken = await hashToken(rawToken);
  const hasedEmail = await hashEmail(email);
  const expireTime = new Date(Date.now() + 5 * 60 * 1000);
  const token = {
    email: hasedEmail,
    token: hashedToken,
    expireTime,
  };
  return token;
};

export const compare = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
