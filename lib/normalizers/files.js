'use strict';

var utils = require('../utils');

module.exports = function(files, key, config, schema) {
  files = utils.arrayify(files).filter(Boolean);
  files = utils.union([], files, config.files);

  var len = files.length;
  var idx = -1;
  var res = [];

  while (++idx < len) {
    var file = files[idx];
    if (utils.exists(file)) {
      res.push(file);
    }
  }

  if (res.length) {
    config[key] = res;
    return res;
  }

  // don't use `omit`, so the key can be re-added
  // by `update`
  delete config[key];
  return;
};
