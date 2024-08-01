const { object, string, number, array } = require("yup");

const paymentCreateSchema = object().shape({
  name: string().required("User name is required."),
  amount: number().required("Payment amount is required."),
  description: string().required("Description is required."),
  currency: string().required("Currency is required."),
});

module.exports = {
  paymentCreateSchema,
};
