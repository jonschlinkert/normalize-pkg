'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (utils.isObject(val) && val.url) {
    val = val.url;
  }

  if (!utils.isString(val) && config.homepage) {
    val = config.homepage;
  }

  var opts = utils.merge({}, schema.options, config);

  if (typeof val === 'undefined' && opts.name && opts.owner) {
    return utils.repo.repository(opts);
  }

  if (utils.isString(val)) {
    return utils.repo.repository(val);
  }

  // if not returned already, val is invalid
  delete config[key];
  return;
};
