const path = require("path");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate.middleware",
));
const UserStrategy = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authenticate",
));
const authorize = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authorize",
));
const { createNewsletterSchema } = require(path.join(
  process.cwd(),
  "src/modules/newsletter/newsletter.schema",
));
const { getAllNewsletter, createNewsletter } = require(path.join(
  process.cwd(),
  "src/modules/newsletter/newsletter.controller",
));

module.exports = (app) => {
  app
    .route("/api/v1/secured/newsletter")
    .get(UserStrategy, authorize(["admin"]), getAllNewsletter);

  app
    .route("/api/v1/public/newsletter")
    .post(validate(createNewsletterSchema), createNewsletter);
};
