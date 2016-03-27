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
    var obj = git(val, key, config, schema);
    if (obj && obj.user) {
      config.owner = obj.user.name;
    }
  }

  if (config.owner) {
    var repo = config.owner + '/' + path.basename(process.cwd());
    config[key] = utils.homepage(repo, config);
    schema.update('repository', config);
    return config[key];
  }
};
