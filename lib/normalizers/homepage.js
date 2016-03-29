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

  var opts = utils.merge({}, schema.options, config);
  if (!utils.isString(opts.owner)) {
    var parsed = git(val, key, config, schema);
    opts.owner = parsed.user.name;
  }

  if (utils.isString(opts.owner) && utils.isString(opts.name)) {
    return utils.repo.homepage(opts.owner + '/' + opts.name);
  }
};
