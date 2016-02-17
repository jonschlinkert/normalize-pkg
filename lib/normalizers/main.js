'use strict';

var utils = require('../utils');

module.exports = function(val, key, config) {
  if (typeof val === 'undefined' && utils.exists('index.js')) {
    config[key] = 'index.js';
    return config[key];
  }

  if (typeof val === 'string' && !utils.exists(val)) {
    delete config[key];
    return;
  }

  if (typeof config.files === 'undefined') {
    config.files = [val];
    return val;
  }

  config.files = utils.arrayify(config.files);
  if (!~config.files.indexOf(val)) {
    config.files.push(val);
  }
  return val;
};

