const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const access_token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.COOKIE_PARSER_TOKEN,
    {
      expiresIn: "24h",
      issuer: user.id.toString(),
    },
  );

  return access_token;
};

// Middleware to check JWT and extend expiration time if needed
function tokenExpireTimeExtend(req, res, next) {
  let token = null;

  if (req && req.signedCookies) {
    token = req.signedCookies["access_token"];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.COOKIE_PARSER_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      const currentTime = Math.floor(Date.now() / 1000);
      const { exp } = decoded;
      decoded.exp = 5000;
      req.decoded = decoded;

      // if (exp - currentTime < 1800) {
      //     Less than 30 minutes left
      //     Extend the expiration time by adding 30 minutes to the current time
      //     const newExpTime = currentTime + 1800;
      //     Update the token's expiration time
      //     Set the updated token in the request header
      // }
    }
  });
}

module.exports.generateAccessToken = generateAccessToken;
module.exports.tokenExpireTimeExtend = tokenExpireTimeExtend;
