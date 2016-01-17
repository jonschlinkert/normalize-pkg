'use strict';

var utils = require('./utils');

module.exports = function(files) {
  var len = files.length;
  var idx = -1;
  while (++i < len) {
    var file = files[idx];
    if (!utils.exists(file)) {
      return false;
    }
  }
  return true;
};
