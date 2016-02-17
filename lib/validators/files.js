'use strict';

var utils = require('../utils');

module.exports = function(files) {
  var len = files.length;
  var idx = -1;
  while (++idx < len) {
    var file = files[idx];
    if (!utils.exists(file)) {
      return false;
    }
  }
  return true;
};
