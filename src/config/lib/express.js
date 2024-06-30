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

  // const corsOptions = {
  //   credentials: true,
  //   origin: (origin, callback) => {
  //     return callback(null, true);
  //   },
  // };

  // app.use(cors(corsOptions));

  const allowedOrigins = [process.env.FRONTEND_BASE_URL];

  const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_BASE_URL);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

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
