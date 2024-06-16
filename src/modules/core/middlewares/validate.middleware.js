const path = require("path");
const { API_response } = require(path.join(
  process.cwd(),
  "src/config/lib/response",
));

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const errors = [];

      err.inner.forEach((e) => {
        errors.push({ path: e.path, message: e.message });
      });

      const response = API_response({
        errors,
        status: 400,
        message: "Data validation error",
      });

      res.status(400).send(response);
    }
  };
};

module.exports = validate;
