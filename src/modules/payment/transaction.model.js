const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema(
  {
    user_id: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    currency_code: {
      type: String,
      required: true,
    },
    total_amount: {
      type: String,
      required: true,
    },
    total_night: {
      type: String,
      required: true,
    },
    partner_order_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
  },
);

const Transaction = model("Transaction", TransactionSchema);

module.exports = Transaction;
