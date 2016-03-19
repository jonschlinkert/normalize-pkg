'use strict';

var utils = require('../utils');

module.exports = function(files, key, config, schema) {
  files = utils.arrayify(files).filter(Boolean);
  var len = files.length;
  var idx = -1;
  var res = [];

  while (++idx < len) {
    var file = files[idx];
    if (utils.exists(file)) {
      res.push(file);
    }
  }

  if (res.length === 0) {
    schema.omit(key);
    return;
  }
  return res;
};
