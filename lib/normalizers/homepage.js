'use strict';

var path = require('path');
var utils = require('../utils');
var git = require('./git');

module.exports = function(val, key, config, schema) {
  if (schema.options.homepage) {
    return schema.options.homepage;
  }

  schema.update('repository', config);

  if (utils.isString(config.repository)) {
    return utils.repo.homepage(config.repository);
  }

  if (utils.isString(val)) return val;

  var obj = utils.merge({}, schema.options, config);
  if (!utils.isString(obj.owner)) {
    var parsed = git(val, key, config, schema);
    if (parsed && parsed.user) {
      obj.owner = parsed.user.name;
    }
  }

  if (utils.isString(obj.owner) && utils.isString(obj.name)) {
    return utils.repo.homepage(obj.owner + '/' + obj.name);
  }
};
