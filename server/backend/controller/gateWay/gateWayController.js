import {
  handleEmailLoginGateway,
  emailTokenGateWay,
} from "./loginGateway/emailLogin.js";
import { tokenAuth ,passwordAuth} from "./loginGateway/passwordLogin.js";

const loginController = async (req, res) => {
  try {
    if (!req.body.type) {
      return res.status(400).send({ msg: "type not found!" });
    }
    const { type } = req.body;
    const initEmailSession = async (req, res) => {
      try {
        const [login, token] = await Promise.all([
          handleEmailLoginGateway(req, res),
          emailTokenGateWay(req, res),
        ]);
        return res.status(200).json({
          login,
          token,
        });
      } catch (err) {
        console.error("💥 Promise.all error:", err);
        return res.status(500).json({ error: err.message });
      }
    };
    switch (type) {
      case "email":
        return initEmailSession(req, res);
      case "password/token/auth":
        return await tokenAuth(req, res);
      case "password/auth":
        return await passwordAuth(req, res);
      default:
        return res.status(400).json({ msg: "Unknown type 🤔" });
    }
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};

export default loginController;
