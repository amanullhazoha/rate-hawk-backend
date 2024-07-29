const path = require("path");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate.middleware",
));
const authorize = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authorize",
));
const UserStrategy = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authenticate",
));
const { stripePaymentIntent, getAllTransaction } = require(path.join(
  process.cwd(),
  "src/modules/payment/payment.controller",
));

module.exports = (app) => {
  app
    .route("/api/v1/secured/stripe/payment")
    .post(UserStrategy, stripePaymentIntent);

  app
    .route("/api/v1/secured/transaction-history")
    .get(UserStrategy, authorize(["admin"]), getAllTransaction);
};
