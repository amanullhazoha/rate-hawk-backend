const { Schema, model } = require("mongoose");

const VerifyTokenSchema = new Schema(
  {
    created_by: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    expire_date: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
  },
);

const VerifyToken = model("verify_token", VerifyTokenSchema);

module.exports = VerifyToken;
