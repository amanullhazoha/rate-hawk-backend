const nodemailer = require("nodemailer");

module.exports = (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SENDER_HOST,
    port: process.env.EMAIL_SENDER_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_SENDER_ACCOUNT,
      pass: process.env.EMAIL_SENDER_PASSWORD,
    },
  });

  // let mailOptions = {
  //     to,
  //     from: process.env.EMAIL_SENDER_ACCOUNT,
  //     subject: "Test Email from Node.js",
  //     text: "This is a test email sent from a Node.js app!",
  //     html: "<b>Hello from Node.js!</b>",
  // };

  const mailOptions = {
    ...options,
    from: process.env.EMAIL_SENDER_ACCOUNT,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
