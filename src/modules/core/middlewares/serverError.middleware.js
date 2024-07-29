const path = require("path");
const { API_response } = require(path.join(
  process.cwd(),
  "src/config/lib/response",
));

const serverError = (error, req, res, next) => {
  console.log(error);

  const response = API_response({
    status: 500,
    message: error?.message ? error?.message : "Internal server error.",
  });

  res.status(500).send(response);
};

module.exports = serverError;
