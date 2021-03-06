'use strict';

const utils = require('../utils');
const merge = require('../merge');

module.exports = function(val, key, config, schema) {
  merge(config, schema);
  val = val || config[key];

  if (utils.isObject(val) && utils.isString(val.test) && /mocha -R \w+$/.test(val.test)) {
    val.test = 'mocha';
  }
  return val;
};
