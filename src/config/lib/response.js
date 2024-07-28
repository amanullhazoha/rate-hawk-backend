const API_response = ({ status, message, ...parameter }) => {
  return {
    status,
    message,
    ...parameter,
  };
};

module.exports.API_response = API_response;
