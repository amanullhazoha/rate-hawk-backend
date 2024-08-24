const path = require("path");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const connectDB = require("../db/index");
const { stripeWebHook } = require("../../modules/payment/payment.controller");

const cookieParser = require("cookie-parser");
const config = require(path.join(process.cwd(), "src/config"));
const serverError = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/serverError.middleware",
));

module.exports = async () => {
  const app = express();

  await connectDB();

  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebHook,
  );

  const allowedOrigins = process.env.FRONTEND_BASE_URL.split(",");

  console.log(allowedOrigins);
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        console.error(`Origin not allowed by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  };

  app.use(cors(corsOptions));

  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));

  app.set("trust proxy", true);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.options("*", cors(corsOptions));

  app.use(cookieParser(process.env.COOKIE_PARSER_TOKEN));
  app.use(
    session({
      secret: "mySecret",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    }),
  );

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
