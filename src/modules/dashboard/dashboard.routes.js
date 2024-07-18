const path = require("path");
const { getAdminDashboard } = require("./dashboard.controller");
const UserStrategy = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authenticate",
));

module.exports = (app) => {
  app
    .route("/api/v1/secured/admin-dashboard")
    .get(UserStrategy, getAdminDashboard);
};
