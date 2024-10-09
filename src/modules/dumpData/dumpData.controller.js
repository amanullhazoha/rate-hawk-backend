const fs = require("fs");
const path = require("path");
const axios = require("axios");
const multer = require("multer");
const AdmZip = require("adm-zip");
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
      }
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

const downloadDumpIncrementalData = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://api.worldota.net/api/b2b/v3/hotel/info/incremental_dump/",
      {
        language: "en",
      },
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = {
      code: 200,
      message: "Multi Complete successfully",
      data: data.data,
      links: {
        self: req.url,
      },
    };

    console.log(response);

    // Now make a request to download the file from the extracted URL
    const response2 = await axios({
      method: "get",
      url: data?.data?.data?.url,
      responseType: "stream", // Important to get the file as a stream
    });

    console.log("downloading file");

    // Create a write stream to save the file in the 'dumps' folder
    const filePath = path.join(
      process.cwd(),
      "uploads",
      `incremental_dump_${Date.now()}.json.zst`
    );
    const writer = fs.createWriteStream(filePath);

    // Pipe the response stream to the file
    response2.data.pipe(writer);

    // Handle successful file write
    writer.on("finish", async () => {
      console.log("File downloaded and saved successfully:", filePath);

      const zip = new AdmZip(filePath);

      zip.extractAllTo(path.join(process.cwd(), "uploads"), true);

      // const decompressedFilePath = zstdFilePath.replace(".zstd", ".json"); // Save as a .json file
      // const zstdFileBuffer = fs.readFileSync(zstdFilePath); // Read the compressed file
      // const decompressedBuffer = await zstd.decompress(zstdFileBuffer); // Decompress the file

      // // Step 5: Save the decompressed content as a new file
      // fs.writeFileSync(decompressedFilePath, decompressedBuffer);
    });

    // Handle file write errors
    writer.on("error", (err) => {
      console.error("Error writing file:", err);
    });

    // res.status(200).send(response);
  } catch (error) {
    console.log(error);

    // next(error);
  }
};

module.exports = {
  DeleteDumpData,
  uploadDumpData,
  downloadDumpData,
  getAllHotelList,
  downloadDumpIncrementalData,
};
