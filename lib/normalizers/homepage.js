'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (!utils.isString(val)) {
    schema.update('repository', config);
    val = config.repository;
  }
  if (utils.isString(val)) {
    return utils.homepage(val);
  }
};
