'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (utils.isObject(val)) {
    for (var prop in val) {
      var filepath = val[prop];
      if (!utils.exists(filepath)) {
        schema.warning('invalidFile', key, {actual: filepath});
      }
    }
  }

  if (val && typeof val === 'string' && !utils.exists(val)) {
    schema.warning('invalidFile', key, {actual: val});
  }
  return true;
};
