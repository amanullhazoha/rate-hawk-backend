const path = require("path");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate.middleware",
));
const { createContactSchema } = require(path.join(
  process.cwd(),
  "src/modules/contact/contact.schema",
));
const { createContactMessage } = require(path.join(
  process.cwd(),
  "src/modules/contact/contact.controller",
));

module.exports = (app) => {
  app
    .route("/api/v1/public/contact-us")
    .post(validate(createContactSchema), createContactMessage);
};
