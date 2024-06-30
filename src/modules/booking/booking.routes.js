const path = require("path");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate.middleware",
));
const UserStrategy = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/authenticate",
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
  getHotelData,
  createPreBook,
  multiComplete,
  getHotelHashID,
  hotelSearchByRegion,
} = require(path.join(process.cwd(), "src/modules/booking/booking.controller"));

module.exports = (app) => {
  app
    .route("/api/v1/secured/search/multi-complete")
    .post(validate(multiCompleteSchema), multiComplete);

  app.route("/api/v1/secured/search/hotel-data").post(getHotelData);

  app
    .route("/api/v1/secured/search/hotel-by-region")
    .post(validate(hotelSearchByRegionSchema), hotelSearchByRegion);

  app
    .route("/api/v1/secured/search/hotel-info")
    .post(validate(hotelInfoSchema), hotelInfo);

  app
    .route("/api/v1/secured/search/hotel-hash-id")
    .post(validate(hotelHashIDSchema), getHotelHashID);

  app
    .route("/api/v1/secured/order/create")
    .post(UserStrategy, validate(oderSchema), createOrder);

  app
    .route("/api/v1/secured/pre-book/create")
    .post(UserStrategy, validate(preOderSchema), createPreBook);
};
