const axios = require("axios");
const { v4 } = require("uuid");
const Hotel = require("./hotel.model");
const Order = require("./Order.model");
const { badRequest } = require("../../config/lib/error");
const { getIpAddress } = require("../../config/utilities");

const username = process.env.RATE_HAWK_USER_NAME;
const password = process.env.RATE_HAWK_PASSWORD;

const encodedCredentials = btoa(`${username}:${password}`);

const getHotelData = async (req, res, next) => {
  try {
    const language = req.body.language;
    const region_id = req.body.region_id;
    const hotel_ids = req.body.hotel_ids;

    const data = await Promise.all(
      hotel_ids?.map(async (id) => {
        const existData = await Hotel.findOne({ hotel_id: id, region_id });

        if (existData) return existData;
        else {
          const data = await axios.post(
            "https://api.worldota.net/api/b2b/v3/hotel/info/",
            { id, language },
            {
              headers: {
                Authorization: `Basic ${encodedCredentials}`,
                "Content-Type": "application/json",
              },
            },
          );

          const getHotel = data.data.data;

          if (getHotel) {
            const hotel = new Hotel({
              region_id,
              hotel_id: id,
              kind: getHotel.kind,
              images: getHotel.images,
              hotel_name: getHotel.name,
              latitude: getHotel.latitude,
              longitude: getHotel.longitude,
              star_rating: getHotel.star_rating,
              region_name: getHotel.region.name,
            });

            const hotelData = await hotel.save();

            return hotelData;
          }
        }
      }),
    );

    const response = {
      code: 200,
      message: "Get hotel data successfully",
      data: data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const multiComplete = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/search/multicomplete/",
      req.body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    const response = {
      code: 200,
      message: "Multi Complete successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const hotelSearchByRegion = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/search/serp/region/",
      req.body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    const response = {
      code: 200,
      message: "Hotel search successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const hotelSearchByHotelId = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/search/serp/hotels/",
      req.body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    const response = {
      code: 200,
      message: "Hotel rate gate successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const hotelInfo = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/info/",
      req.body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    const response = {
      code: 200,
      message: "Hotel search successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getHotelHashID = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/search/hp/",
      req.body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    const response = {
      code: 200,
      message: "Hotel search successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error, "hi");

    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const ip = getIpAddress(req);

    console.log(ip, "ip");

    const {
      room,
      kind,
      adults,
      user_ip,
      hotel_id,
      currency,
      book_hash,
      region_id,
      residency,
      check_in,
      language,
      children,
      check_out,
      hotel_name,
      region_name,
      choose_room,
      star_rating,
      total_night,
      total_amount,
      price_per_night,
      total_commission,
      partner_order_id,
    } = req.body;

    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/order/booking/form/",
      {
        user_ip,
        language,
        book_hash,
        partner_order_id,
      },
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    const payment_type = data?.data?.data?.payment_types?.find(
      (item) => item.currency_code === currency,
    );

    const order = new Order({
      kind,
      user_id,
      language,
      children,
      check_in,
      hotel_id,
      residency,
      region_id,
      check_out,
      hotel_name,
      room: room,
      total_night,
      star_rating,
      region_name,
      total_amount,
      guests: adults,
      price_per_night,
      partner_order_id,
      total_commission,
      status: "pending",
      images: room.images,
      rg_ext: room?.rg_ext,
      room_name: room?.name,
      currency_code: currency,
      choose_room: choose_room,
      order_id: data?.data?.data?.order_id,
      pay_uuid: payment_type?.type === "now" ? v4() : "",
      init_uuid: payment_type?.type === "now" ? v4() : "",
      payment_type: payment_type ? payment_type?.type : "deposit",
    });

    const orderData = await order.save();

    const response = {
      code: 200,
      message: "Order create successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const createUserOrder = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const {
      kind,
      room,
      images,
      latitude,
      hotel_id,
      region_id,
      longitude,
      hotel_name,
      star_rating,
      region_name,
      partner_order_id,
    } = req.body;

    const order = new Order({
      kind,
      room,
      images,
      user_id,
      latitude,
      hotel_id,
      region_id,
      longitude,
      hotel_name,
      choose_room,
      star_rating,
      region_name,
      partner_order_id,
    });

    const orderData = await order.save();

    const response = {
      code: 200,
      message: "User order create successfully",
      data: orderData,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const orderFinish = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/",
      req.body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    const response = {
      code: 200,
      message: "Hotel search successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const orderCancel = async (req, res, next) => {
  try {
    const partner_order_id = req.body.partner_order_id;

    const order = await Order.findOne({
      status: "completed",
      partner_order_id,
    });

    if (!order) throw badRequest("Order not found by partner order ID.");

    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/order/cancel/",
      { partner_order_id },
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    order.status = "cancelled";

    await order.save();

    const response = {
      code: 200,
      message: "Hotel search successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const orderInfo = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/order/info/",
      req.body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    const response = {
      code: 200,
      message: "Hotel search successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const createPreBook = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/prebook",
      req.body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    const response = {
      code: 200,
      message: "Hotel pre book successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getAllOrder = async (req, res, next) => {
  try {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 10;

    const orders = await Order.find()
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalItems = await Order.countDocuments().exec();

    const response = {
      code: 200,
      message: "Get all order successfully",
      data: orders,
      links: {
        self: req.url,
      },
      pagination: {
        page,
        limit,
        totalItems,
        totalPage: Math.ceil(totalItems / limit),
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getAllOrderByUserId = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 10;

    const orders = await Order.find({ user_id })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalItems = await Order.countDocuments().exec();

    const response = {
      code: 200,
      message: "Get all order successfully",
      data: orders,
      links: {
        self: req.url,
      },
      pagination: {
        page,
        limit,
        totalItems,
        totalPage: Math.ceil(totalItems / limit),
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getOrderByOrderId = async (req, res, next) => {
  try {
    const order_id = req.params.id;

    const order = await Order.findOne({ order_id });

    const response = {
      code: 200,
      message: "Get order by order ID successfully",
      data: order,
      links: {
        self: req.url,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

module.exports = {
  getAllOrder,
  getOrderByOrderId,
  getAllOrderByUserId,
  orderCancel,
  orderInfo,
  hotelInfo,
  orderFinish,
  createOrder,
  getHotelData,
  createPreBook,
  multiComplete,
  getHotelHashID,
  createUserOrder,
  hotelSearchByRegion,
  hotelSearchByHotelId,
};
