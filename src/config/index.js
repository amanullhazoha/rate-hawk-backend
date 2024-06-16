const path = require("path");
const { sync } = require("glob");
const { isArray, union, isString } = require("lodash");

const getGlobedPaths = (globPatterns, excludes) => {
  let urlRegex = new RegExp("^(?:[a-z]+:)?//", "i");

  let output = [];

  if (isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = union(output, getGlobedPaths(globPattern, excludes));
    });
  } else if (isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = sync(globPatterns);

      if (excludes) {
        files = files.map(function (file) {
          if (isArray(excludes)) {
            for (let i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], "");
              }
            }
          } else {
            file = file.replace(excludes, "");
          }
          return file;
        });
      }
      output = union(output, files);
    }
  }

  return output;
};

module.exports.getGlobalConfig = () => {
  const assets = require(path.join(process.cwd(), "src/config/assets/default"));

  const config = {
    routes: getGlobedPaths(assets.routes),
    strategies: getGlobedPaths(assets.strategies),
  };

  return config;
};
