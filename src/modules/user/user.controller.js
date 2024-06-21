const User = require("./user.model");
const { badRequest } = require("../../config/lib/error");

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

const updateUserProfile = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const {
      age,
      name,
      sect,
      gender,
      country,
      childrens,
      expectedDate,
      childAgeGroup,
      isExpectingBaby,
      isAlreadyParent,
    } = req.body;

    const user = await User.findById(user_id);

    if (!user) throw badRequest("User not exist!");

    const payload = {
      age,
      name,
      sect,
      gender,
      country,
      childrens,
      expectedDate,
      childAgeGroup,
      isExpectingBaby,
      isAlreadyParent,
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

module.exports.getUserProfile = getUserProfile;
module.exports.updateUserProfile = updateUserProfile;
