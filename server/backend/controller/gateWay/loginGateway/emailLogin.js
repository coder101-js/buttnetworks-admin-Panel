import dotenv from "dotenv";
import process from "process";
dotenv.config({ path: "../../../.env" });

export const handleEmailLoginGateway = async (req, res) => {
  if (!req.body) {
    return res.status(404).send({ msg: "Data not found!" });
  } else if (req.body.type === "email") {
    const apiKey = process.env.API_KEY;
    const { email } = req.body;
    try {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ email: email }),
      };

      const response = await fetch("https://api.admin.buttnetworks.com/login/email", option);
      const data = await response.json();
      return data
    } catch (error) {
      console.error("💥 Email API Error:", error);
      return res.status(500).send({ error: "Something went wrong 😢" });
    }
  }
};
export const emailTokenGateWay = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ msg: "data not found!" });
  }
  try {
    if (!req.body.email) {
      return res.status(400).send({ msg: "email not found!" });
    }
    try {
      const apiKey = process.env.API_KEY;
      const { email:rawEmail } = req.body;
      const {email} =JSON.parse(rawEmail)
      const option = {
        method: "GET",
        headers: { "x-api-key": apiKey },
      };
      const api = await fetch(
        `https://api.admin.buttnetworks.com/login/token?email=${encodeURIComponent(email)}`,
        option
      );
      const response = await api.json();
      const value = response;
      const { id } = value;
      return id;
    } catch (err) {
      return res.status(500).send({ msg: err });
    }
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};
