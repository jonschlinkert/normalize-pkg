'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (val && typeof val === 'string') {
    return val;
  }
  if (!val && schema.data.name) {
    return schema.data.name;
  }
  schema.update('homepage', config);
  return schema.data.name;
};
