'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  schema.error(key, 'Field is deprecated. Define "license" as a string instead.');
};
