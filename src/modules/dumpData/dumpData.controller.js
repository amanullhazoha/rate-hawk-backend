const fs = require("fs");
const axios = require("axios");
const multer = require("multer");
const HotelDump = require("./dumpData.model");

const username = process.env.RATE_HAWK_USER_NAME;
const password = process.env.RATE_HAWK_PASSWORD;

const upload = multer({ dest: "uploads/" }).single("file");

const encodedCredentials = btoa(`${username}:${password}`);

const downloadDumpData = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/info/dump/",
      {
        inventory: "all",
        language: "en",
      },
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

// const uploadDumpData = async (req, res, next) => {
//   try {
//     upload(req, res, async function (err) {
//       if (err instanceof multer.MulterError) {
//         return res.status(400).send({ error: err.message });
//       } else if (err) {
//         return res.status(500).send({ error: "Something went wrong" });
//       }

//       if (!req.file) {
//         return res.status(400).send({ error: "No file uploaded" });
//       }

//       const filePath = req.file.path;

//       try {
//         const fileContent = fs.readFileSync(filePath, "utf8");

//         const jsonData = JSON.parse(fileContent);

//         const dumpData = await HotelDump.insertMany(jsonData);

//         fs.unlinkSync(filePath);

//         const response = {
//           code: 200,
//           message: "Hotel dump data uploaded successfully",
//           data: { message: "Data upload done." },
//           links: {
//             self: req.url,
//           },
//         };

//         res.status(200).send(response);
//       } catch (parseError) {
//         return res.status(400).send({ error: "Invalid JSON format" });
//       }
//     });
//   } catch (error) {
//     console.log(error);

//     next(error);
//   }
// };

const uploadDumpData = async (req, res, next) => {
  try {
    const { hotels } = req.body;
    console.log(req.body.hotels);

    const dumpData = await HotelDump.insertMany(hotels);

    const response = {
      code: 200,
      message: "Hotel dump data uploaded successfully",
      data: { message: "Data upload done." },
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

const DeleteDumpData = async (req, res, next) => {
  try {
    const dumpData = await HotelDump.deleteMany();

    const response = {
      code: 200,
      message: "Hotel dump data delete successful",
      data: dumpData,
      links: req.path,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getAllHotelList = async (req, res, next) => {
  try {
    const filters = req.query.filters;
    const star_rating = req.query.star;
    const region_id = req.query.region_id;
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 8;

    let filterBy = {};

    if (region_id) {
      filterBy = {
        ...filterBy,
        "region.id": Number(region_id),
      };
    }

    if (star_rating) {
      filterBy = {
        ...filterBy,
        star_rating: Number(star_rating),
      };
    }

    if (filters) {
      filterBy = {
        ...filterBy,
        serp_filters: { $in: filters },
      };
    }

    const hotels = await HotelDump.find(filterBy)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalItems = await HotelDump.countDocuments(filterBy).exec();

    const response = {
      code: 200,
      message: "Get hotel data successful",
      data: hotels,
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
  DeleteDumpData,
  uploadDumpData,
  downloadDumpData,
  getAllHotelList,
};
