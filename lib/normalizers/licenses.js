'use strict';

var license = require('./license');
var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (Array.isArray(val)) {
    schema.update('license', val[0].type, config);
    delete config[key];
  } else {
    delete config[key];
    return license(val, 'license', config, schema);
  }
};
