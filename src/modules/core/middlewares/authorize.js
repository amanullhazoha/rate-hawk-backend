const { authorizationError } = require("../../../config/lib/error");

const authorize =
  (roles = ["admin", "user"]) =>
  (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }

    return next(authorizationError());
  };

module.exports = authorize;
