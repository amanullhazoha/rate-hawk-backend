const { object, string, array } = require("yup");

const createUserSchema = object().shape({
  user_name: string().required("User name is required."),
  email: string()
    .min(3, "Email at least 3 character.")
    .max(100, "Email at most 100 character.")
    .required("User email is required."),
  password: string()
    .min(8, "Password at least 8 character.")
    .max(100, "Password at most 100 character.")
    .required("User password is required."),
  gender: string().required("User gender is required."),
  address: string()
    .min(5, "Address at least 5 character.")
    .max(200, "Address at most 200 character.")
    .required("User password is required."),
  phone: string(),
  bath_date: string(),
  about_you: string()
    .min(5, "About at least 5 character.")
    .max(500, "About at most 500 character."),
  role: string().oneOf(["admin", "user"]).required("Role is required."),
});

const updaterUserSchema = object().shape({
  user_name: string().required("User name is required."),
  gender: string()
    .oneOf(["male", "female"])
    .required("User gender is required."),
  address: string()
    .min(5, "Address at least 5 character.")
    .max(200, "Address at most 200 character.")
    .required("User password is required."),
  phone: string(),
  bath_date: string(),
  about_you: string()
    .min(5, "About at least 5 character.")
    .max(500, "About at most 500 character.")
    .required("About is required."),
  role: string().oneOf(["admin", "user"]).required("Role is required."),
});

const changePasswordSchema = object().shape({
  new_password: string().required("User new password is required."),
  old_password: string().required("User old password is required."),
});

const updateLoggedInUserSchema = object().shape({
  user_name: string().required("User name is required."),
  gender: string()
    .oneOf(["male", "female"])
    .required("User gender is required."),
  address: string()
    .min(5, "Address at least 5 character.")
    .max(200, "Address at most 200 character.")
    .required("Address is required."),
  phone: string(),
  bath_date: string(),
  about_you: string()
    .min(5, "About at least 5 character.")
    .max(500, "About at most 500 character.")
    .required("About is required."),
});

module.exports = {
  createUserSchema,
  updaterUserSchema,
  changePasswordSchema,
  updateLoggedInUserSchema,
};
