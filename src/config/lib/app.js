const path = require("path");

module.exports.start = async () => {
  const app = await require(path.join(
    process.cwd(),
    "src/config/lib/express",
  ))();

  app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
  });
};
