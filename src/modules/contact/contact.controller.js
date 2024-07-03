const { badRequest } = require("../../config/lib/error");
const nodemailer = require("../../config/emailService/config");
const { contactUsTemplate } = require("../../config/emailService/template");

const createContactMessage = async (req, res, next) => {
  try {
    const { email, user_name, message } = req.body;

    nodemailer(contactUsTemplate(email, user_name, message));

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
