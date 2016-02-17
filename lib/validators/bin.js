'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (utils.isObject(val)) {
    for (var prop in val) {
      if (val.hasOwnProperty(prop)) {
        var filepath = val[prop];
        if (!utils.exists(filepath)) {
          schema.error('validate', key, `file '${filepath}' does not exist`);
        }
      }
    }
  }

  if (typeof val === 'string' && !utils.exists(val)) {
    schema.error('validate', key, `file '${val}' does not exist`);
  }
  return true;
};
