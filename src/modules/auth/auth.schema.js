const { object, string, boolean } = require("yup");

const userSignupSchema = object().shape({
  email: string().required("User email is required."),
  user_name: string().required("User name is required."),
  password: string().required("User password is required."),
  is_agree: boolean()
    .isTrue("User can agree to term and conditions.")
    .required("Is agree required."),
});

const userLoginSchema = object().shape({
  email: string().required("User email is required."),
  password: string().required("User password is required."),
});

const forgotPasswordSchema = object().shape({
  email: string().required("User email is required."),
});

const resetPasswordSchema = object().shape({
  token: string().required("Token is required."),
  email: string().required("User email is required."),
  password: string().required("User password is required."),
});

module.exports = {
  userLoginSchema,
  userSignupSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
};
