'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (schema.options.bugs) {
    return schema.options.bugs;
  }

  schema.update('repository', config);

  if (utils.isString(config.homepage)) {
    return { url: utils.repo.issues(config.homepage) };
  }

  if (utils.isObject(val) && utils.isString(val.url)) {
    return val;
  }

  if (utils.isString(val)) {
    return { url: utils.repo.issues(val) };
  }
};
