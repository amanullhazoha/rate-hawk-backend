const path = require("path");
// const passport = require("passport");
// const validate = require(path.join(
//   process.cwd(),
//   "src/modules/core/middlewares/validate.middleware",
// ));
const UserStrategy = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authenticate",
));
const authorize = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authorize",
));
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
const { getUserProfile, updateUserProfile } = require(path.join(
  process.cwd(),
  "src/modules/user/user.controller",
));

module.exports = (app) => {
  app
    .route("/api/v1/secured/user/profile")
    .get(UserStrategy, authorize(["admin"]), getUserProfile)
    .put(UserStrategy, updateUserProfile);

  app.route("/api/v1/secured/change-password").put(UserStrategy, (req, res) => {
    res.status(200).send("user password successfully");
  });

  app
    .route("/api/v1/secured/user")
    .get(UserStrategy, authorize(["admin"]), (req, res) => {
      res.status(200).send("get all user successfully");
    })
    .post((req, res) => {
      res.status(200).send("user create successfully");
    });

  app
    .route("/api/v1/secured/user/:id")
    .get(UserStrategy, authorize(["admin"]), (req, res) => {
      res.status(200).send("get user by id successfully");
    })
    .put((req, res) => {
      res.status(200).send("user update by id successfully");
    })
    .delete(UserStrategy, authorize(["admin"]), (req, res) => {
      res.status(200).send("user delete by id successfully");
    });

  app.post("/api/v1/secured/user/logout", UserStrategy, (req, res) => {
    res.status(200).send("user logout successfully");
  });
};
