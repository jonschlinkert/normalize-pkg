'use strict';

var utils = require('../utils');

module.exports = function(val, key, config, schema) {
  if (!val && !schema.data.repository) {
    if ((val = utils.remote.sync())) {
      schema.data.set('remote', val);
    }
  }

  if (utils.isObject(val) && val.url) {
    val = val.url;
  }

  if (val && typeof val === 'string') {
    var parsed = utils.parseUrl(val);
    schema.data.merge(parsed);
    return parsed.repository;
  }

  // if not returned already, val is invalid
  schema.omit(key);
  return;
};
