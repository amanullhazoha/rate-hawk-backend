const User = require("../user/user.model");
const Order = require("../booking/Order.model");
const HotelDump = require("../dumpData/dumpData.model");
const Transaction = require("../payment/transaction.model");

const getAdminDashboard = async (req, res, next) => {
  try {
    const total_user = await User.countDocuments();
    const total_order = await Order.countDocuments();
    const total_hotel = await HotelDump.countDocuments();
    const total_transaction = await Transaction.countDocuments();

    const hotels = await HotelDump.find().sort({ _id: 1 }).limit(10).exec();

    const response = {
      code: 200,
      message: "User get all successfully",
      data: {
        hotels,
        total_user,
        total_hotel,
        total_order,
        total_transaction,
      },
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

module.exports = {
  getAdminDashboard,
};
