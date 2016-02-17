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

  var parsed = {};
  if (val && typeof val === 'string') {
    parsed = utils.parseUrl(val);
    var repository = parsed.repository;
    schema.data.merge(parsed);
  }
  return repository;
};
