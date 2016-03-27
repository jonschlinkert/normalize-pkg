'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (utils.isObject(val)) {
    return val;
  }

  if (!config.parsedGitHubUrl) {
    schema.update('homepage', config);
  }

  if (utils.isString(config.repository)) {
    config[key] = { url: utils.toGithubUrl(config) + '/issues' };
    return config[key];
  }
};
