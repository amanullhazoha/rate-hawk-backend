const path = require("path");
// const passport = require("passport");
// const validate = require(path.join(
//   process.cwd(),
//   "src/modules/core/middlewares/validate.middleware",
// ));
// const UserStrategy = require(path.join(
//   process.cwd(),
//   "src/modules/user/user.authentication.middleware",
// ));
// const { Services } = require(path.join(
//   process.cwd(),
//   "src/modules/core/authorization/authorization.constant",
// ));
// const { ServiceGuard } = require(path.join(
//   process.cwd(),
//   "src/modules/core/authorization/authorization.middleware",
// ));
// const {
//   userLoginSchema,
//   userSignupSchema,
//   createUserSchema,
//   updaterUserSchema,
//   resetPasswordSchema,
//   changePasswordSchema,
//   forgotPasswordSchema,
//   updateLoggedInUserSchema,
// } = require(path.join(process.cwd(), "src/modules/user/user.schema"));
// const {
//   userLogin,
//   userLogout,
//   createUser,
//   getAllUser,
//   userSignUp,
//   emailVerify,
//   getUserByID,
//   resetPassword,
//   changePassword,
//   forgotPassword,
//   updateUserByID,
//   deleteUserByID,
//   getLoggedInUserData,
//   updateLoggedInUserData,
//   userGoogleLoginCallBack,
// } = require(path.join(process.cwd(), "src/modules/user/user.controller"));

module.exports = (app) => {
  app
    .route("/api/v1/secured/user/profile")
    .get((req, res) => {
      res.status(200).send("profile get successfully");
    })
    .put((req, res) => {
      res.status(200).send("profile update successfully");
    });

  app.route("/api/v1/secured/change-password").put((req, res) => {
    res.status(200).send("user password successfully");
  });

  app
    .route("/api/v1/secured/user")
    .get((req, res) => {
      res.status(200).send("get all user successfully");
    })
    .post((req, res) => {
      res.status(200).send("user create successfully");
    });

  app
    .route("/api/v1/secured/user/:id")
    .get((req, res) => {
      res.status(200).send("get user by id successfully");
    })
    .put((req, res) => {
      res.status(200).send("user update by id successfully");
    })
    .delete((req, res) => {
      res.status(200).send("user delete by id successfully");
    });

  app.post("/api/v1/secured/user/logout", (req, res) => {
    res.status(200).send("user logout successfully");
  });

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
    "/auth/google",
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
