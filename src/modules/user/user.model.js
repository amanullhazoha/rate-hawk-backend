const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 100,
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    address: {
      type: String,
      minLength: 5,
      maxLength: 200,
    },
    phone: String,
    bath_date: Date,
    is_agree: Boolean,
    about_you: {
      type: String,
      minLength: 5,
      maxLength: 500,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    email_verify: {
      type: String,
      enum: ["verified", "unverified"],
      default: "unverified",
    },
  },
  {
    timestamps: true,
    id: true,
  },
);

const User = model("User", userSchema);

module.exports = User;
