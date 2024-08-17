const path = require("path");
const { orderFinish, orderInfo } = require("./booking.controller");
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
  hotelSearchByIdsSchema,
  hotelSearchByRegionSchema,
} = require(path.join(process.cwd(), "src/modules/booking/booking.schema"));
const {
  hotelInfo,
  createOrder,
  getHotelData,
  createPreBook,
  multiComplete,
  getHotelHashID,
  createUserOrder,
  hotelSearchByRegion,
  hotelSearchByHotelId,
  orderCancel,
  getAllOrder,
  getOrderByOrderId,
  getAllOrderByUserId,
} = require(path.join(process.cwd(), "src/modules/booking/booking.controller"));

module.exports = (app) => {
  app
    .route("/api/v1/public/search/multi-complete")
    .post(validate(multiCompleteSchema), multiComplete);

  app.route("/api/v1/public/search/hotel-data").post(getHotelData);

  app
    .route("/api/v1/public/search/hotel-by-region")
    .post(validate(hotelSearchByRegionSchema), hotelSearchByRegion);

  app
    .route("/api/v1/public/search/hotel-by-ids")
    .post(validate(hotelSearchByIdsSchema), hotelSearchByHotelId);

  app
    .route("/api/v1/public/search/hotel-info")
    .post(validate(hotelInfoSchema), hotelInfo);

  app
    .route("/api/v1/public/search/hotel-hash-id")
    .post(validate(hotelHashIDSchema), getHotelHashID);

  app
    .route("/api/v1/secured/order/create")
    .post(UserStrategy, validate(oderSchema), createOrder);

  app.route("/api/v1/secured/order/finish").post(UserStrategy, orderFinish);

  app.route("/api/v1/secured/order/cancel").post(UserStrategy, orderCancel);

  app.route("/api/v1/secured/order/info").post(UserStrategy, orderInfo);

  app.route("/api/v1/secured/all/order").get(UserStrategy, getAllOrder);

  app
    .route("/api/v1/secured/user-order")
    .get(UserStrategy, getAllOrderByUserId)
    .post(UserStrategy, createUserOrder);

  app.route("/api/v1/secured/user/order/:id").get(getOrderByOrderId);

  app
    .route("/api/v1/public/prebook-hash")
    .post(validate(preOderSchema), createPreBook);

  app
    .route("/api/v1/rate-hawk/webhook")
    .post((req, res) => res.status(200).send("webhook call"));
};
