const { badRequest } = require("../../config/lib/error");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const stripePaymentIntent = async (req, res, next) => {
  try {
    const product = {
      name: "amanullha zoha",
      description: "Zoha description",
      amount: 140,
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product?.name,
              description: product?.description,
            },
            unit_amount: product?.amount * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: `amanullhazoha3784@gmail.com`,
      metadata: {
        name: "amanullha zoha",
        description: "Zoha description",
        amount: 140,
      },

      success_url: `${process.env.FRONTEND_BASE_URL}/success`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/error`,
    });

    // res.redirect(303, session.url);

    // test purpose
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

module.exports = {
  stripePaymentIntent,
};