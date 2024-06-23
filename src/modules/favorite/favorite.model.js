const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: Object,
      required: true,
    },
    hotel_id: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    id: true,
  },
);

const Favorite = model("favorite", favoriteSchema);

module.exports = Favorite;
