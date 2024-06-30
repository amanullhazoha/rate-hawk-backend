const User = require("./user.model");
const { badRequest } = require("../../config/lib/error");
const nodemailer = require("../../config/emailService/config");
const { emailVerifyTemplate } = require("../../config/emailService/template");
const {
  hashPassword,
  comparePassword,
} = require("../../config/lib/hashFunction");

const getUserProfile = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const user = await User.findById(user_id);

    if (!user) throw badRequest("User not exist!");

    const response = {
      code: 200,
      message: "User get successfully",
      data: user,
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

const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find();

    const response = {
      code: 200,
      message: "User get all successfully",
      data: user,
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

const updateUserProfile = async (req, res, next) => {
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

const passwordChange = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const { new_password, old_password } = req.body;

    const user = await User.findById(user_id);

    if (!user) throw badRequest("User not exist!");

    const match = await comparePassword(old_password, user.password);

    if (!match) return res.status(400).send("Invalid credentials.");

    const hashedPassword = await hashPassword(new_password);

    const payload = {
      password: hashedPassword,
    };

    Object.keys(payload).forEach((key) => {
      user[key] = payload[key] ?? user[key];
    });

    await user.save();

    const response = {
      code: 200,
      message: "User password update successful",
      data: user,
      links: req.path,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const getUserByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) throw badRequest("User not found by ID.");

    const response = {
      code: 200,
      message: "User get by ID successfully",
      data: user,
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

const createUser = async (req, res, next) => {
  try {
    const {
      role,
      phone,
      email,
      gender,
      address,
      is_agree,
      password,
      about_you,
      user_name,
      bath_date,
    } = req.body;

    const isExistByEmail = await User.findOne({ email });

    if (isExistByEmail) throw badRequest("User already exist by email.");

    const hashedPassword = await hashPassword(password);

    const user = new User({
      role,
      phone,
      email,
      gender,
      address,
      is_agree,
      about_you,
      user_name,
      bath_date,
      password: hashedPassword,
    });

    const userData = await user.save();

    nodemailer(emailVerifyTemplate(user.email, user.user_name));

    const response = {
      code: 200,
      message: "User create successful",
      data: userData,
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

const updateUserByID = async (req, res, next) => {
  try {
    const id = req.params.id;

    const { role, phone, gender, address, about_you, user_name, bath_date } =
      req.body;

    const user = await User.findById(id);

    if (!user) throw badRequest("User not exist!");

    const payload = {
      role,
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

const deleteUserByID = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) throw badRequest("User not exist!");

    await User.deleteOne({ _id: user.id });

    const response = {
      code: 200,
      message: "User delete successful",
      data: user,
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

const logout = (req, res) => {
  // res.clearCookie("access_token", { domain: "noblenames.co.uk" });

  const response = {
    code: 200,
    message: "User password update successful",
    data: "User logged out!",
    links: req.path,
  };

  res.clearCookie("access_token");
  res.status(200).json(response);
};

module.exports = {
  logout,
  createUser,
  getAllUser,
  getUserByID,
  updateUserByID,
  deleteUserByID,
  getUserProfile,
  passwordChange,
  updateUserProfile,
};
