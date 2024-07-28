const badRequest = (message = "Bad Request") => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const serverError = (message = "Internal Server Error") => {
  const error = new Error(message);
  error.status = 500;
  return error;
};

const authenticationError = (message = "Authentication Failed") => {
  const error = new Error(message);
  error.status = 401;
  return error;
};

const authorizationError = (message = "Permission Denied") => {
  const error = new Error(message);
  error.status = 403;
  return error;
};

const notFoundError = (message = "Resource not found") => {
  const error = new Error(message);
  error.status = 404;
  return error;
};

module.exports = {
  badRequest,
  serverError,
  notFoundError,
  authorizationError,
  authenticationError,
};
