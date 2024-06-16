const { object, string, boolean } = require("yup");

const userSignupSchema = object().shape({
  email: string().required("User email is required."),
  user_name: string().required("User name is required."),
  password: string().required("User password is required."),
  is_agree: boolean()
    .isTrue("User can agree to term and conditions.")
    .required("User mobile is required."),
});

const userLoginSchema = object().shape({
  email: string().required("User email is required."),
  password: string().required("User password is required."),
});

const forgotPasswordSchema = object().shape({
  email: string().required("User email is required."),
});

const resetPasswordSchema = object().shape({
  email: string().required("User email is required."),
  otp_id: string().required("User OTP ID is required."),
  otp_code: string().required("User OTP code is required."),
  password: string().required("User password is required."),
});

module.exports = {
  userLoginSchema,
  userSignupSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
};
