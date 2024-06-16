const validate = require("../core/middlewares/validate.middleware");
const {
  userLoginSchema,
  userSignupSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} = require("./auth.schema");
const {
  userLogin,
  userSignUp,
  resetPassword,
  forgotPassword,
  userEmailVerify,
} = require("./auth.controller");

module.exports = (app) => {
  app.post("/api/v1/public/login", validate(userLoginSchema), userLogin);

  app.post("/api/v1/public/signup", validate(userSignupSchema), userSignUp);

  app.post(
    "/api/v1/public/forgot-password",
    validate(forgotPasswordSchema),
    forgotPassword,
  );

  app.post(
    "/api/v1/public/reset-password",
    validate(resetPasswordSchema),
    resetPassword,
  );

  app.get("/api/v1/public/email-verify", userEmailVerify);
};
