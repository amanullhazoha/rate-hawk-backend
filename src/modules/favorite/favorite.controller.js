const Favorite = require("./favorite.model");
const { badRequest } = require("../../config/lib/error");

const getAllFavoriteByUser = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const favorites = await Favorite.find({ user: user_id });

    const response = {
      code: 200,
      message: "Get all favorite successfully",
      data: favorites,
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

const addToFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const { hotel, hotel_id } = req.body;

    const isExist = await Favorite.findOne({ id: user_id, hotel_id });

    if (isExist) throw badRequest("Already added this hotel.");

    const favorite = new Favorite({
      user: user_id,
      hotel,
      hotel_id,
    });

    const favoriteData = await favorite.save();

    const response = {
      code: 200,
      message: "Add favorite successfully",
      data: favoriteData,
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

const removeFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const id = req.params.id;

    const isExist = await Favorite.findOne({ hotel_id: id, user: user_id });

    if (!isExist) throw badRequest("Favorite not found by this ID.");

    const favorite = await Favorite.deleteOne({ _id: isExist._id });

    const response = {
      code: 200,
      message: "Remove favorite successfully",
      data: isExist,
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

module.exports = {
  addToFavorite,
  removeFavorite,
  getAllFavoriteByUser,
};
