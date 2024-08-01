const axios = require("axios");
const User = require("../user/user.model");
const Order = require("../booking/Order.model");
const Transaction = require("./transaction.model");
const { badRequest } = require("../../config/lib/error");

const username = process.env.RATE_HAWK_USER_NAME;
const password = process.env.RATE_HAWK_PASSWORD;

const encodedCredentials = btoa(`${username}:${password}`);

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const orderFinish = async (payload) => {
  console.log(payload);

  const data = await axios.post(
    "https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/",
    payload,
    {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
    },
  );

  console.log(data?.data, "order finish");

  return data;
};

const stripePaymentIntent = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const user = await User.findById(user_id);

    if (!user) throw badRequest("User not exist!");

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

    if (!updateOrder)
      return res.status(400).json({ message: "Order not found!" });

    if (updateOrder) {
      updateOrder.status = "Paid";

      await updateOrder.save();
    }

    console.log(updateOrder?.payment_type);

    const orderFinishData = JSON.stringify({
      return_path:
        updateOrder?.payment_type === "now"
          ? `api.travelmeester.nl?order_id=${updateOrder?.order_id}`
          : null,
      user: {
        email: session.customer_details.email,
        phone: session.metadata.phone,
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
        type: updateOrder?.payment_type,
        amount: updateOrder?.total_amount,
        currency_code: updateOrder?.currency_code,
        pay_uuid:
          updateOrder?.payment_type === "now" ? updateOrder?.pay_uuid : null,
        init_uuid:
          updateOrder?.payment_type === "now" ? updateOrder?.init_uuid : null,
        // type: updateOrder?.choose_room?.payment_options?.payment_types[0]?.type,
      },
    });

    const data = await orderFinish(orderFinishData);

    // if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    if (data?.data?.status === "error")
      return res.status(400).json({ message: data?.data?.error });

    return res.status(200).json({ message: "Payment is Successfully!" });
    // nodeMailer(template.subscription(user.email, user.name));
  }
};

const getAllTransaction = async (req, res, next) => {
  try {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 8;

    const transactions = await Transaction.find()
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalItems = await Transaction.countDocuments().exec();

    const response = {
      code: 200,
      message: "Get transaction data successful",
      data: transactions,
      links: req.path,
      pagination: {
        page,
        limit,
        totalItems,
        totalPage: Math.ceil(totalItems / limit),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

module.exports = {
  stripeWebHook,
  getAllTransaction,
  stripePaymentIntent,
};
