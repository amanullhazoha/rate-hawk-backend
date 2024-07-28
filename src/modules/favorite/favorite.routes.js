const path = require("path");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate.middleware",
));
const UserStrategy = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authenticate",
));
const { createFavoriteSchema } = require(path.join(
  process.cwd(),
  "src/modules/favorite/favorite.schema",
));
const {
  addToFavorite,
  removeFavorite,
  getAllFavoriteByUser,
} = require(path.join(
  process.cwd(),
  "src/modules/favorite/favorite.controller",
));

module.exports = (app) => {
  app
    .route("/api/v1/secured/favorite")
    .get(UserStrategy, getAllFavoriteByUser)
    .post(UserStrategy, validate(createFavoriteSchema), addToFavorite);

  app
    .route("/api/v1/secured/favorite/:id")
    .delete(UserStrategy, removeFavorite);
};
