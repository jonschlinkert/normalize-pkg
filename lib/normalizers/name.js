'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (utils.isString(val)) return val;
  schema.update('repository', config);
  return utils.project(process.cwd());
};
