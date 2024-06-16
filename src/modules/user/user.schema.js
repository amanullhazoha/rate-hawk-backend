const { object, string, array } = require("yup");

const createUserSchema = object().shape({
  profile_image: string(),
  email: string().required("User email is required."),
  gender: string().required("User gender is required."),
  mobile: string().required("User mobile is required."),
  password: string().required("User password is required."),
  full_name: string().required("User full name is required."),
  profile_id: string().required("User profile ID is required."),
  dateOfBirth: string().required("User date of birth is required."),
});

const updaterUserSchema = object().shape({
  profile_image: string(),
  email: string().required("User email is required."),
  gender: string().required("User gender is required."),
  mobile: string().required("User mobile is required."),
  password: string().required("User password is required."),
  full_name: string().required("User full name is required."),
  profile_id: string().required("User profile ID is required."),
  dateOfBirth: string().required("User date of birth is required."),
});

const userSignupSchema = object().shape({
  email: string().required("User email is required."),
  gender: string().required("User gender is required."),
  mobile: string().required("User mobile is required."),
  password: string().required("User password is required."),
  full_name: string().required("User full name is required."),
  dateOfBirth: string().required("User date of birth is required."),
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

const changePasswordSchema = object().shape({
  new_password: string().required("User new password is required."),
  old_password: string().required("User old password is required."),
});

const updateLoggedInUserSchema = object().shape({
  profile_image: string(),
  gender: string().required("User gender is required."),
  mobile: string().required("User mobile is required."),
  full_name: string().required("User full name is required."),
  dateOfBirth: string().required("User date of birth is required."),
});

module.exports.userLoginSchema = userLoginSchema;
module.exports.userSignupSchema = userSignupSchema;
module.exports.createUserSchema = createUserSchema;
module.exports.updaterUserSchema = updaterUserSchema;
module.exports.resetPasswordSchema = resetPasswordSchema;
module.exports.forgotPasswordSchema = forgotPasswordSchema;
module.exports.changePasswordSchema = changePasswordSchema;
module.exports.updateLoggedInUserSchema = updateLoggedInUserSchema;
