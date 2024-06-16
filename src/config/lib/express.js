const path = require("path");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const connectDB = require("../db/index");

const cookieParser = require("cookie-parser");
const config = require(path.join(process.cwd(), "src/config"));
const serverError = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/serverError.middleware",
));

module.exports = async () => {
  const app = express();

  await connectDB();

  app.use(express.json());
  app.use(cookieParser(process.env.COOKIE_PARSER_TOKEN));
  app.use(
    session({
      secret: "mySecret",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    }),
  );

  const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
      return callback(null, true);
    },
  };

  app.use(cors(corsOptions));

  const globalConfig = config.getGlobalConfig();

  globalConfig.routes.forEach((routePath) => {
    require(path.resolve(routePath))(app);
  });

  globalConfig.strategies.forEach((strategyPath) => {
    require(path.resolve(strategyPath))();
  });

  app.use(serverError);

  return app;
};
