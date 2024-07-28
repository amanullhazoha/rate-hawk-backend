const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema(
  {
    payment_id: {
      type: String,
    },
    subscription_id: {
      type: String,
    },
    invoice_id: {
      type: String,
    },
    order_id: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    customer_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
    payment_method: {
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
