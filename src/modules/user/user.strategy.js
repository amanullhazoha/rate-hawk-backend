const path = require("path");
const passport = require("passport");
const { Strategy } = require("passport-jwt");
const User = require(path.join(process.cwd(), "src/modules/user/user.model"));

module.exports = () => {
  const cookieExtractor = (req) => {
    let token = null;

    if (req && req.signedCookies) {
      token = req.signedCookies["access_token"];
    }

    return token;
  };

  passport.use(
    "user-jwt",
    new Strategy(
      {
        secretOrKey: process.env.COOKIE_PARSER_TOKEN,
        jwtFromRequest: cookieExtractor,
      },
      (payload, done) => {
        console.log(payload, "hi");
        User.findOne({ _id: payload.id }).then((user) => {
          if (user) return done(null, user);

          return done(null, false);
        });
      },
    ),
  );
};
