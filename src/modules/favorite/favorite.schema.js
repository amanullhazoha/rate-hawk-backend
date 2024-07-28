const { object, string } = require("yup");

const createFavoriteSchema = object().shape({
  hotel: object().required("User name is required."),
  hotel_id: string().required("Hotel ID is required."),
});

module.exports = {
  createFavoriteSchema,
};
