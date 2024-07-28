const { Schema, model } = require("mongoose");

const hotelDumpSchema = new Schema(
  {
    address: {
      type: String,
    },
    amenity_groups: {
      type: [Schema.Types.Mixed],
    },
    check_in_time: {
      type: String,
    },
    check_out_time: {
      type: String,
    },
    description_struct: {
      type: [Schema.Types.Mixed],
    },
    id: {
      type: String,
    },
    images: {
      type: [String],
    },
    kind: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    policy_struct: {
      type: [Schema.Types.Mixed],
    },
    postal_code: {
      type: String,
    },
    room_groups: {
      type: [Schema.Types.Mixed],
    },
    region: {
      type: Object,
    },
    star_rating: {
      type: Number,
    },
    email: {
      type: String,
    },
    serp_filters: {
      type: [Schema.Types.Mixed],
    },
    is_closed: {
      type: Boolean,
    },
    is_gender_specification_required: {
      type: Boolean,
    },
    metapolicy_struct: {
      type: Object,
    },
    metapolicy_extra_info: {
      type: Object,
    },
    star_certificate: {
      type: Object,
    },
  },
  {
    timestamps: true,
    id: true,
  },
);

const HotelDump = model("Hotel_dump", hotelDumpSchema);

module.exports = HotelDump;
