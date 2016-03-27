'use strict';

var path = require('path');
var utils = require('../utils');
var git = require('./git');

module.exports = function(val, key, config, schema) {
  if (utils.isString(val)) return val;
  schema.update('repository', config);
  if (utils.isString(config.repository)) {
    val = utils.homepage(config.repository, config);
  }

  if (!utils.isString(val) && !utils.isString(config.owner)) {
    var parsed = git(val, key, config, schema);
    if (parsed && parsed.user) {
      config.owner = parsed.user.name;
    }
  }

  if (config.owner) {
    var repo = config.owner + '/' + config.name || path.basename(process.cwd());
    config[key] = utils.homepage(repo, config);
    schema.update('repository', config);

    // remove `owner` after normalize is finished
    schema.omit('owner');
    return config[key];
  }
};
