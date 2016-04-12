'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (schema.options.bugs) {
    val = config[key] =  schema.options.bugs;
  }

  if (utils.isString(val)) {
    return { url: utils.repo.issues(val) };
  }

  if (utils.isObject(val) && utils.isString(val.url)) {
    return { url: utils.repo.issues(utils.repo.homepage(val.url)) };
  }

  schema.update('repository', config);
  if (utils.isString(config.homepage)) {
    return { url: utils.repo.issues(config.homepage) };
  }
};
