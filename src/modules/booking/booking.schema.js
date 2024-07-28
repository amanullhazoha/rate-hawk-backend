const { object, string, number, array } = require("yup");

const preOderSchema = object().shape({
  hash: string().required("Hash is required."),
  price_increase_percent: number().required(
    "Price increase percent is required.",
  ),
});

const oderSchema = object().shape({
  user_ip: string().required("User IP is required."),
  language: string().required("Language is required."),
  book_hash: string().required("Book hash is required."),
  partner_order_id: string().required("User order id is required."),
});

const hotelHashIDSchema = object().shape({
  checkin: string().required("Check in date is required."),
  checkout: string().required("Check out data is required."),
  residency: string().required("Residency is required."),
  language: string().required("Language is required."),
  id: string().required("Hotel ID is required."),
  currency: string().required("Currency is required."),
  guests: array().required("Currency is required."),
});

const hotelInfoSchema = object().shape({
  language: string().required("Language is required."),
  id: string().required("Hotel ID is required."),
});

const hotelSearchByRegionSchema = object().shape({
  checkin: string().required("Check in date is required."),
  checkout: string().required("Check out data is required."),
  residency: string().required("Residency is required."),
  language: string().required("Language is required."),
  region_id: string().required("Region ID is required."),
  currency: string().required("Currency is required."),
  guests: array().required("Currency is required."),
});

const hotelSearchByIdsSchema = object().shape({
  checkin: string().required("Check in date is required."),
  checkout: string().required("Check out data is required."),
  residency: string().required("Residency is required."),
  language: string().required("Language is required."),
  currency: string().required("Currency is required."),
  guests: array().required("Currency is required."),
  ids: array().min(1, "At least add one ID."),
});

const multiCompleteSchema = object().shape({
  query: string().required("Query is required."),
  language: string().required("Language is required."),
});

module.exports = {
  oderSchema,
  preOderSchema,
  hotelInfoSchema,
  hotelHashIDSchema,
  multiCompleteSchema,
  hotelSearchByIdsSchema,
  hotelSearchByRegionSchema,
};
