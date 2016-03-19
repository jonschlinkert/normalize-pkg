'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (utils.isObject(val)) {
    return val.type;
  }
  if (Array.isArray(val)) {
    return val[0].type;
  }
  if (typeof val === 'string') {
    return val;
  }
};
