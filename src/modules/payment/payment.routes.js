const path = require("path");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate.middleware",
));
const UserStrategy = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authenticate",
));
const {
  oderSchema,
  preOderSchema,
  hotelInfoSchema,
  hotelHashIDSchema,
  multiCompleteSchema,
  hotelSearchByRegionSchema,
} = require(path.join(process.cwd(), "src/modules/booking/booking.schema"));
const { stripePaymentIntent } = require(path.join(
  process.cwd(),
  "src/modules/payment/payment.controller",
));

module.exports = (app) => {
  app.route("/api/v1/secured/stripe/payment").post(stripePaymentIntent);
};
