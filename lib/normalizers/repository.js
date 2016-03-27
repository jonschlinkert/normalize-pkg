'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (typeof val === 'undefined' && config.owner) {
    val = config[key] = utils.toRepository(config.owner, config.name);
  }

  if (typeof val === 'undefined') {
    val = utils.remote.sync();
  }

  if (utils.isObject(val) && val.url) {
    val = val.url;
  }

  if (utils.isString(val)) {
    utils.parseGithubUrl(val, config);
    schema.update('bugs', config);
    return config.repo;
  }

  // if not returned already, val is invalid
  delete config[key];
  return;
};
