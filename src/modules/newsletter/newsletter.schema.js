const { object, string } = require("yup");

const createNewsletterSchema = object().shape({
  email: string()
    .min(3, "Email at least 3 character.")
    .max(100, "Email at most 100 character.")
    .required("User email is required."),
});

module.exports = {
  createNewsletterSchema,
};
