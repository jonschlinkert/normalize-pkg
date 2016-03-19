'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (val && typeof val === 'string') return val;
  schema.update('repository', config);

  if (config.repository) {
    return utils.homepage(config.repository);
  }
};
