'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (utils.isObject(val) && utils.isString(val.url)) {
    return val;
  }

  if (!utils.isString(val)) {
    schema.update('repository', config);
    val = config.homepage;
  }

  if (utils.isString(val)) {
    return { url: utils.repo.issues(val) };
  }
};
