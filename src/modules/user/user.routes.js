const path = require("path");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate.middleware",
));
const UserStrategy = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authenticate",
));
const authorize = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authorize",
));
const {
  createUserSchema,
  updaterUserSchema,
  changePasswordSchema,
  updateLoggedInUserSchema,
} = require(path.join(process.cwd(), "src/modules/user/user.schema"));
const {
  logout,
  createUser,
  getAllUser,
  getUserByID,
  updateUserByID,
  passwordChange,
  deleteUserByID,
  getUserProfile,
  updateUserProfile,
} = require(path.join(process.cwd(), "src/modules/user/user.controller"));

module.exports = (app) => {
  app
    .route("/api/v1/secured/user/profile")
    .get(UserStrategy, getUserProfile)
    .put(UserStrategy, validate(updateLoggedInUserSchema), updateUserProfile);

  app
    .route("/api/v1/secured/user/change-password")
    .put(UserStrategy, validate(changePasswordSchema), passwordChange);

  app
    .route("/api/v1/secured/user")
    .get(UserStrategy, authorize(["admin"]), getAllUser)
    .post(
      UserStrategy,
      authorize(["admin"]),
      validate(createUserSchema),
      createUser,
    );

  app
    .route("/api/v1/secured/user/:id")
    .get(UserStrategy, authorize(["admin"]), getUserByID)
    .put(
      UserStrategy,
      authorize(["admin"]),
      validate(updaterUserSchema),
      updateUserByID,
    )
    .delete(UserStrategy, authorize(["admin"]), deleteUserByID);

  app.post("/api/v1/secured/user/logout", UserStrategy, logout);
};
