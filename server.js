(function () {
  const path = require("path");
  const app = require(path.join(process.cwd(), "src/config/lib/app"));

  app.start();
})();
