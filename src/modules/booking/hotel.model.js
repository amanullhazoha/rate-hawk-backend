const { Schema, model } = require("mongoose");
const { array, string } = require("yup");

const hotelSchema = new Schema(
  {
    region_id: {
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
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
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
  },
  {
    timestamps: true,
    id: true,
  },
);

const Hotel = model("Hotel", hotelSchema);

module.exports = Hotel;
