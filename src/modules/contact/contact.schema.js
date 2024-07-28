const { object, string } = require("yup");

const createContactSchema = object().shape({
  email: string()
    .min(3, "Email at least 3 character.")
    .max(100, "Email at most 100 character.")
    .required("User email is required."),
  user_name: string()
    .min(3, "Name at least 3 character.")
    .max(100, "Name at most 100 character.")
    .required("User Name is required."),
  message: string()
    .min(3, "Message at least 3 character.")
    .max(100, "Message at most 100 character.")
    .required("Message is required."),
});

module.exports = {
  createContactSchema,
};
