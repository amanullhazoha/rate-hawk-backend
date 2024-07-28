const { badRequest } = require("../../config/lib/error");
const Transaction = require("./transaction.model");
const Order = require("../booking/Order.model");
const User = require("../user/user.model");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const orderFinish = async (data) => {
  const data = await axios.post(
    "https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/",
    data,
    {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (data?.data?.status === "error") throw badRequest(data?.data?.error);
};

const stripePaymentIntent = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const user = await User.findById(user_id);

    if (!user) throw badRequest("User not exist!");

    // console.log(req.body);

    const product = {
      created_by: user_id,
      name: req.body.hotel_name,
      amount: req.body.total_amount,
      description: req.body.hotel_name,
      currency: req.body.currency.toLowerCase(),
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: product?.currency,
            product_data: {
              name: product?.name,
              description: product?.description,
            },
            unit_amount: product?.amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: req.body,
      customer_email: user?.email,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/error`,
      success_url: `${process.env.FRONTEND_BASE_URL}/success`,
    });

    // res.redirect(303, session.url);

    // test purpose
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const stripeWebHook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    console.log("Error", err.message);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(session, "webhook");

    const transaction = new Transaction({
      payment_id: session.id,
      status: session.status,
      currency: session.currency,
      invoice_id: session.invoice,
      customer_id: session.customer,
      amount: session.amount_total / 100,
      order_id: session.metadata.order_id,
      subscription_id: session.subscription,
      payment_status: session.payment_status,
      customer_name: session.customer_details.name,
      customer_email: session.customer_details.email,
      payment_method: session.payment_method_types[0],
    });

    const transactionData = await transaction.save();

    const updateOrder = await Order.findOne({
      status: "Pending",
      order_id: session.metadata.order_id,
    });

    updateOrder.status = "Paid";
    await updateOrder.save();

    const orderFinishData = JSON.stringify({
      user: {
        email: session.customer_details.email,
        phone: "12312321",
      },
      partner: {
        partner_order_id: updateOrder?.partner_order_id,
      },
      language: "en",
      rooms: [
        {
          guests: [
            {
              first_name: "Marty",
              last_name: "Ratehawk",
            },
          ],
        },
      ],
      payment_type: {
        type: "deposit",
        amount: Number(updateOrder?.total_amount),
        currency_code: updateOrder?.currency_code,
      },
    });

    await orderFinish(orderFinishData);

    // nodeMailer(template.subscription(user.email, user.name));
  }

  // Return a 200 res to acknowledge receipt of the event
  res.status(200).json({ message: "Payment is Successfully!" });
};

module.exports = {
  stripeWebHook,
  stripePaymentIntent,
};
