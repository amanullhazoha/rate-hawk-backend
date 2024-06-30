const { badRequest } = require("../../config/lib/error");

const createContactMessage = async (req, res, next) => {
  try {
    const { email, user_name, message } = req.body;

    const response = {
      code: 200,
      message: "Contact message send successful",
      data: req.body,
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
  createContactMessage,
};
