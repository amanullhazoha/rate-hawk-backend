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
  DeleteDumpData,
  uploadDumpData,
  getAllHotelList,
  downloadDumpData,
} = require(path.join(
  process.cwd(),
  "src/modules/dumpData/dumpData.controller",
));

module.exports = (app) => {
  app
    .route("/api/v1/secured/dump-data")
    .get(downloadDumpData)
    .post(uploadDumpData)
    // .post(UserStrategy, authorize(["admin"]), uploadDumpData)
    .delete(UserStrategy, authorize(["admin"]), DeleteDumpData);

  app.route("/api/v1/public/dump-hotel").get(getAllHotelList);

  app.route("/api/v1/public/dump-hotel/:id").post(downloadDumpData);
};
