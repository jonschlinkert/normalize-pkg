'use strict';

var utils = require('../utils');

module.exports = function (val, key, config, schema) {
  if (!config.hasOwnProperty('bin') && val === true) {
    schema.error('validate', key, 'expected "bin" to be defined when "preferGlobal" is true');
  }
};
