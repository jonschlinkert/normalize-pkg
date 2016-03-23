'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (utils.isObject(val) && /mocha -R \w+$/.test(val.test)) {
    val.test = 'mocha';
  }
  return val;
};
