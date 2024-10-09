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
  userGoogleLoginCallBack,
  userFacebookLoginCallBack,
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
    "/api/v1/public/google-login",
    passport.authenticate("google", {
      access_type: "offline",
      scope: ["profile", "email"],
    }),
    (req, res) => {
      res.status(200).send("user google login successfully");
    },
  );

  app.get(
    "/api/v1/public/google-callback",
    passport.authenticate("google", {
      failureRedirect: process.env.GOOGLE_OAUTH_FAILURE_REDIRECT,
    }),
    userGoogleLoginCallBack,
  );

  app.get(
    "/api/v1/public/facebook-login",
    passport.authenticate("facebook"),
    (req, res) => {
      res.status(200).send("User facebook login successfully");
    },
  );

  app.get(
    "/api/v1/public/facebook-callback",
    passport.authenticate("facebook", {
      failureRedirect: process.env.GOOGLE_OAUTH_FAILURE_REDIRECT,
    }),
    userFacebookLoginCallBack,
  );
};
