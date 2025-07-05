import userData from "../../../DataBase/model/UserData.js";
import EmailToken from "../../../DataBase/model/EmailToken.js";
import {
  compare,
  emailToken,
  isEmailMatch,
} from "../../module/sessionToken.js";

export const handleEmail = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(404).send({ msg: "Email not found!" });
    }
    const { email: rawEmail } = req.body;
    const { email } = JSON.parse(rawEmail);

    const user = await userData.findOne({ email: email });
    if (!user) {
      res.cookies;
      return res.status(404).send({
        email: {
          exist: false,
          block: false,
        },
      });
    } else {
      return res.status(200).send({
        email: {
          exist: true,
          block: false,
        },
      });
    }
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};
export const handleEmailAuthToken = async (req, res) => {
  const { email } = req.query;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ msg: "Valid email is required" });
  }
  try {
    const {
      expireTime,
      token: tokenString,
      email: hashedEmail,
    } = await emailToken(email);
    const tokenDoc = new EmailToken({
      email: hashedEmail,
      token: tokenString,
      expireTime,
    });
    await tokenDoc.save();
    const ID = tokenDoc._id.toString();
    return res.status(200).send({ id: ID });
  } catch (err) {
    return res.status(403).send({ msg: err });
  }
};
export const validateEmailToken = async (req, res) => {
  try {
    const { email, token: tokenId } = req.body;
    if (!req.body) {
      return res.status(403).send({ msg: "Data not found", auth: false });
    }
    if (!email) {
      return res.status(403).send({ msg: "Email not found", auth: false });
    }

    const tokenDoc = await EmailToken.findById(tokenId);
    const { email: hasedEmail } = tokenDoc;
    if (!tokenDoc) {
      //check if token id is valid
      return res.status(404).send({ msg: "Token not found", auth: false });
    }

    if (tokenDoc.expireTime && Date.now() > new Date(tokenDoc.expireTime)) {
      return res.status(403).send({ msg: "Token expired ⌛", auth: false });
    }

    const validate = await isEmailMatch(email, hasedEmail); //check if token belong to user email

    if (validate) {
      return res.status(200).send({ auth: true });
    } else {
      return res.status(403).send({ auth: false });
    }
  } catch (err) {
    console.log(err, "error");
    return res.status(500).send({ msg: "Server error", auth: false });
  }
};

export const handlePassword = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(404).send({ msg: "Password not found!" });
    }
    const { password, email } = req.body;
    const user = await userData.findOne({ email: email });
    const isValid = await compare(password, user.password);
    if (!isValid) {
     return res.status(403).send({ msg: "Incorrect Password", auth: false });
    } else {
     return  res.status(200).send({ msg: "Correct Password", auth: true });
    }
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};
export const authPasswordToken = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(404).send({ msg: "Token ID not found!" });
    }
    const { id } = req.body;
    console.log(req.body);
    const tokenDoc = await EmailToken.findById(id);
    if (!tokenDoc) {
      return res
        .status(440)
        .send({ msg: "Session token Expire!", auth: false, expire: true });
    } else if (tokenDoc) {
      await tokenDoc.deleteOne();
      return res.status(200).send({ auth: true, expire: false });
    }
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};
