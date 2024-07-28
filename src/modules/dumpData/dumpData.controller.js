const axios = require("axios");
const multer = require("multer");
const User = require("../user/user.model");
const HotelDump = require("./dumpData.model");
const { badRequest } = require("../../config/lib/error");

const username = process.env.RATE_HAWK_USER_NAME;
const password = process.env.RATE_HAWK_PASSWORD;

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 5 * 1024 * 1024,
  // },
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype);

    if (file.mimetype !== "application/octet-stream") {
      return cb(new Error("Only json files are allowed"));
    }
    cb(null, true);
  },
}).single("file");

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

const uploadDumpData = async (req, res, next) => {
  try {
    // const filePath = path.join(__dirname, "data.json");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error
        return res.status(400).send({ error: err.message });
      } else if (err) {
        // Other errors
        console.log(err);
        return res.status(500).send({ error: "Something went wrong" });
      }

      const filePath = req.file;

      console.log(req.body);

      const jsonData = JSON.parse(filePath);

      console.log("data upload");

      // DataModel.insertMany(jsonData)
      //   .then(() => {
      //     console.log("Data successfully imported");
      //   })
      //   .catch((err) => {
      //     console.error("Error inserting data", err);
      //   });

      const response = {
        code: 200,
        message: "User get all successfully",
        data: {},
        links: {
          self: req.url,
        },
      };

      res.status(200).send(response);
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const DeleteDumpData = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { user_name, gender, address, phone, bath_date, about_you } =
      req.body;

    const user = await User.findById(user_id);

    if (!user) throw badRequest("User not exist!");

    const payload = {
      phone,
      gender,
      address,
      user_name,
      bath_date,
      about_you,
    };

    Object.keys(payload).forEach((key) => {
      user[key] = payload[key] ?? user[key];
    });

    await user.save();

    const response = {
      code: 200,
      message: "User update successful",
      data: user,
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
