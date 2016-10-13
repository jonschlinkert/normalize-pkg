'use strict';

var utils = require('../../utils');
var git = require('./git');

module.exports = function(val, key, config, schema) {
  var owner = config.owner;
  var url = val;
  var segs;

  if (utils.isObject(url)) {
    url = val.url;
  }

  var repo = config.repository;
  if (utils.isObject(repo) && repo.url) {
    repo = repo.url;
  }

  if (utils.isString(repo)) {
    var obj = utils.repo.parseUrl(repo);
    schema.data.set('owner', obj.owner);
    return obj.owner;
  }

  var parsed = git(val, key, config, schema);
  if (utils.isObject(parsed)) {
    schema.data.set('git', parsed);
    owner = parsed.user && parsed.user.name;

    if (owner) {
      schema.data.set('owner', owner);
      return owner;
    }
  }
};
