import mongoose from "mongoose";

const tokenShema = new mongoose.Schema(
  {
    email:{type:String,required:true},
    token: { type: String, required: true },
    expireTime: { type: Date, required: true },
  }
);

tokenShema.index({ expireTime: 1 }, { expireAfterSeconds: 0 });

const EmailToken = mongoose.model("EmailToken", tokenShema);

export default EmailToken;
