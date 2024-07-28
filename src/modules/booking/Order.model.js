const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
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
    language: {
      type: String,
      required: true,
    },
    residency: {
      type: String,
      required: true,
    },
    partner_order_id: {
      type: String,
      required: true,
    },
    region_id: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    children: {
      type: [],
      required: true,
    },
    check_in: {
      type: String,
      required: true,
    },
    check_out: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    hotel_id: {
      type: String,
      require: true,
    },
    star_rating: {
      type: Number,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
    hotel_name: {
      type: String,
      required: true,
    },
    region_name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    room: {
      type: Object,
      required: true,
    },
    choose_room: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
  },
);

const Order = model("Order", OrderSchema);

module.exports = Order;
