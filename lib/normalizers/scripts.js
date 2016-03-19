'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (utils.isObject(val) && val.test === 'mocha -R spec') {
    val.test = 'mocha';
  }
  return val;
};
