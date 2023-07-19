import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },

  is_email_verified: {
    type: Boolean,
    default: false,
  },
  email_verification_token: {
    type: String,
  },
  profile_pic: {
    type: String,
  },
});

export const User = mongoose.model("User", user_schema);
