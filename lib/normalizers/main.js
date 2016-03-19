'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (typeof val === 'undefined') {
    val = 'index.js';
  }

  if (!utils.exists(val)) {
    schema.omit(key);
    return;
  }

  schema.update('files', config);
  config.files = utils.union([], config.files, val);
  return val;
};
