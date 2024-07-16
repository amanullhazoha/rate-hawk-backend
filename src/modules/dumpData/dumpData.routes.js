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
const { DeleteDumpData, uploadDumpData, downloadDumpData } = require(path.join(
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
};
