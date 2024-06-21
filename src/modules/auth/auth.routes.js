const passport = require("passport");
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

  app.get(
    "/api/v1/public/user/google-login",
    (req, res) => {
      res.status(200).send("user google login successfully");
    },
    // passport.authenticate("google", {
    //   scope: ["profile", "email"],
    // }),
  );
  app.get(
    "/api/v1/public/user/google-callback",
    (req, res) => {
      res.status(200).send("google login callback successfully");
    },
    // passport.authenticate("google", {
    //   failureRedirect: process.env.GOOGLE_OAUTH_FAILURE_REDIRECT,
    // }),
    // userGoogleLoginCallBack,
  );

  app.get(
    "/api/v1/public/user/facebook-login",
    (req, res) => {
      res.status(200).send("user facebook login successfully");
    },
    // passport.authenticate("google", {
    //   scope: ["profile", "email"],
    // }),
  );
};
