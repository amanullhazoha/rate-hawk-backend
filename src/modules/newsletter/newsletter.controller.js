const Newsletter = require("./newsletter.model");
const { badRequest } = require("../../config/lib/error");

const getAllNewsletter = async (req, res, next) => {
  try {
    const newsletter = await Newsletter.find();

    const response = {
      code: 200,
      message: "Newsletter get all successfully",
      data: newsletter,
      links: {
        self: req.url,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const createNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    const isExist = await Newsletter.findOne({ email });

    if (isExist) throw badRequest("Email already exist.");

    const newsletter = new Newsletter({
      email,
    });

    const newsletterData = await newsletter.save();

    const response = {
      code: 200,
      message: "Newsletter create successful",
      data: newsletterData,
      links: {
        self: req.url,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

module.exports = {
  getAllNewsletter,
  createNewsletter,
};
