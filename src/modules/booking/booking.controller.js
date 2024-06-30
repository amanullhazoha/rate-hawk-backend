const axios = require("axios");
const Hotel = require("./hotel.model");
const { badRequest } = require("../../config/lib/error");

const username = "7731";
const password = "ac8e2c78-9ce6-4673-8279-5bdb081b7966";

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
  console.log(req.body);

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
    // console.log(error);

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

module.exports = {
  hotelInfo,
  createOrder,
  getHotelData,
  createPreBook,
  multiComplete,
  getHotelHashID,
  hotelSearchByRegion,
};
