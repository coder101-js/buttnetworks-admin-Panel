import dotenv from "dotenv";
import process from "process";
dotenv.config({ path: "../../../.env" });

export const tokenAuth = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ msg: "data not found" });
  }
  const apiKey = process.env.API_KEY;
  const option ={
    method:'POST',
    headers:{
        'Content-Type':'application/json',
        'x-api-key':apiKey
    },
    body:JSON.stringify(req.body)
  }
  const api = await fetch('http://localhost:3000/login/auth',option)
  const response = await api.json()
  const value = response
  return res.status(200).send(value)
};
export const passwordAuth = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ msg: "data not found" });
  }
  const apiKey = process.env.API_KEY;
  const option ={
    method:'POST',
    headers:{
        'Content-Type':'application/json',
        'x-api-key':apiKey
    },
    body:JSON.stringify(req.body)
  }
  const api = await fetch('http://localhost:3000/login/password',option)
  const response = await api.json()
  const value = response
  console.log(value)
  return res.status(200).send(value)
};
