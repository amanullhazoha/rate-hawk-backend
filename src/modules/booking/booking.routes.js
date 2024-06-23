const path = require("path");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate.middleware",
));
const UserStrategy = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authenticate",
));
const authorize = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authorize",
));
const {
  oderSchema,
  preOderSchema,
  hotelInfoSchema,
  hotelHashIDSchema,
  multiCompleteSchema,
  hotelSearchByRegionSchema,
} = require(path.join(process.cwd(), "src/modules/booking/booking.schema"));
const {
  hotelInfo,
  createOrder,
  createPreBook,
  multiComplete,
  getHotelHashID,
  hotelSearchByRegion,
} = require(path.join(process.cwd(), "src/modules/booking/booking.controller"));

module.exports = (app) => {
  app
    .route("/api/v1/secured/search/multi-complete")
    .post(UserStrategy, validate(multiCompleteSchema), multiComplete);

  app
    .route("/api/v1/secured/search/hotel-by-region")
    .post(
      UserStrategy,
      validate(hotelSearchByRegionSchema),
      hotelSearchByRegion,
    );

  app
    .route("/api/v1/secured/search/hotel-info")
    .post(UserStrategy, validate(hotelInfoSchema), hotelInfo);

  app
    .route("/api/v1/secured/search/hotel-hash-id")
    .post(UserStrategy, validate(hotelHashIDSchema), getHotelHashID);

  app
    .route("/api/v1/secured/order/create")
    .post(UserStrategy, validate(oderSchema), createOrder);

  app
    .route("/api/v1/secured/pre-book/create")
    .post(UserStrategy, validate(preOderSchema), createPreBook);
};
