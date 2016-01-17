'use strict';

var utils = require('./utils');

module.exports = function homepage(val, key, config, schema) {
  if (val && typeof val === 'string') return val;

  if (!config.repository || typeof config.repository !== 'string') {
    this.update('repository', config);
  }

  var repo = config.repository || schema.data.get('repository');

  if (repo && typeof repo === 'string') {
    var parsed = utils.parseUrl(repo);
    var repository = parsed.repository;
    schema.data.merge(parsed);

    return (config[key] = utils.homepage(repository));
  }
};
