const { Schema, model } = require("mongoose");

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 100,
    },
  },
  {
    timestamps: true,
    id: true,
  },
);

const Newsletter = model("Newsletter", newsletterSchema);

module.exports = Newsletter;
