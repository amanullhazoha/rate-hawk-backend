const axios = require("axios");
const Hotel = require("./hotel.model");
const Order = require("./Order.model");
const { badRequest } = require("../../config/lib/error");

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
    console.log(error);

    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const {
      room,
      adults,
      hotel_id,
      currency,
      residency,
      check_in,
      language,
      children,
      check_out,
      hotel_name,
      star_rating,
      total_night,
      total_amount,
      price_per_night,
      partner_order_id,
    } = req.body;

    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/order/booking/form/",
      req.body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (data?.data?.status === "error") throw badRequest(data?.data?.error);

    const order = new Order({
      user_id: "",
      language,
      children,
      check_in,
      hotel_id,
      residency,
      check_out,
      hotel_name,
      total_night,
      star_rating,
      total_amount,
      kind: "Hotel",
      guests: adults,
      price_per_night,
      region_name: "Dhaka",
      partner_order_id,
      images: room.images,
      rg_ext: room?.rg_ext,
      room_name: room?.name,
      currency_code: currency,
      order_id: data?.data?.data?.order_id,
      region_id: "45454",
    });

    const orderData = await order.save();

    console.log(orderData);

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

const createUserOrder = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const {
      kind,
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
      images,
      user_id,
      latitude,
      hotel_id,
      region_id,
      longitude,
      hotel_name,
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
    const orders = await Order.find();

    const response = {
      code: 200,
      message: "Get all order successfully",
      data: orders,
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

const getAllOrderByUserId = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const orders = await Order.find({ user_id });

    const response = {
      code: 200,
      message: "Get all order successfully",
      data: orders,
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
