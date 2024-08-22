const getIpAddress = (req) => {
  let ipAddress =
    req.headers["x-real-ip"] ||
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "";

  if (ipAddress.includes(":")) {
    ipAddress = req.connection.remoteAddress.split(":").pop();
  }

  return ipAddress;
};

module.exports = {
  getIpAddress,
};
