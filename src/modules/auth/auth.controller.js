const User = require("../user/user.model");
const { badRequest } = require("../../config/lib/error");
const VerifyToken = require("../user/verify_token.model");
const { API_response } = require("../../config/lib/response");
const nodemailer = require("../../config/emailService/config");
const { generateAccessToken } = require("../user/user.service");
const {
  emailVerifyTemplate,
  forgotPasswordTemplate,
} = require("../../config/emailService/template");
const {
  hashPassword,
  comparePassword,
} = require("../../config/lib/hashFunction");

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw badRequest("Invalid credentials.");

    const match = await comparePassword(password, user.password);

    if (!match) throw badRequest("Invalid credentials.");

    const access_token = generateAccessToken(user);

    res.cookie("access_token", access_token, {
      httpOnly: true,
      signed: true,
    });

    res.status(200).send({
      access_token,
      userID: user.id,
    });

    // res.status(200).send("User login successfully");
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const userSignUp = async (req, res, next) => {
  try {
    const { user_name, email, password, is_agree } = req.body;

    const isExistByEmail = await User.findOne({ email });

    if (isExistByEmail)
      return res.status(400).json(
        API_response({
          status: 400,
          message: "User already exist by email.",
        }),
      );

    // const isExistByUserName = await User.findOne({ user_name });

    // if (isExistByUserName)
    //   return res.status(400).json(
    //     API_response({
    //       status: 400,
    //       message: "User already exist by username.",
    //     }),
    //   );

    const hashedPassword = await hashPassword(password);

    const user = new User({
      email,
      is_agree,
      user_name,
      password: hashedPassword,
    });

    const userData = await user.save();

    nodemailer(emailVerifyTemplate(user.email, user.user_name));

    res.status(200).send(userData);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const userEmailVerify = async (req, res, next) => {
  try {
    const email = req.query.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/signup`);
    }

    if (user.email_verify === "unverified") {
      const userData = {
        email_verify: "verified",
      };

      Object.keys(userData).forEach((key) => {
        user[key] = userData[key] ?? user[key];
      });

      await user.save();

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const accessToken = generateAccessToken(payload);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        signed: true,
      });
    }

    return res.redirect(process.env.FRONTEND_BASE_URL);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });

    if (!user) throw badRequest("User not found by ID.");

    let currentDate = new Date();
    let expire_date = new Date(currentDate.getTime() + 5 * 60000);

    await VerifyToken.deleteOne({ created_by: user.id });

    const verifyToken = new VerifyToken({
      expire_date,
      email: user.email,
      created_by: user._id,
    });

    const createdVerifyToken = await verifyToken.save();

    nodemailer(
      forgotPasswordTemplate(
        user.email,
        user.user_name,
        createdVerifyToken._id,
      ),
    );

    res.status(200).json({
      message: "Verify link sent on your mail successfully",
      data: {
        expire_date,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw badRequest("Invalid user credential.");

    const verifyToken = await VerifyToken.findOne({ _id: token });

    if (!verifyToken) throw badRequest("Invalid credential");

    if (new Date(verifyToken.expire_date).getTime() < new Date().getTime())
      throw badRequest("OTP code time expire.");

    const hashedPassword = await hashPassword(password);

    const userData = {
      password: hashedPassword,
    };

    Object.keys(userData).forEach((key) => {
      user[key] = userData[key] ?? user[key];
    });

    await user.save();

    await VerifyToken.deleteOne({ created_by: user.id });

    const response = {
      code: 200,
      message: "Password reset successfully.",
      data: user,
      links: req.path,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

module.exports = {
  userLogin,
  userSignUp,
  resetPassword,
  forgotPassword,
  userEmailVerify,
};
