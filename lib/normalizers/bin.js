'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('../utils');

module.exports = function(bin, key, config, schema) {
  var opts = utils.merge({}, schema.options);

  if (opts.bin === false) {
    return bin;
  }

  if (typeof bin === 'string') {
    return bin;
  }

  if (typeof bin === 'undefined') {
    bin = {};
  }

  // ensure `name` is defined before continuing
  schema.update('name', config);

  var obj = {};
  var num = 0;

  if (utils.isObject(bin)) {
    for (var prop in bin) {
      if (utils.exists(bin[prop])) {
        obj[prop] = bin[prop];
        num++;
      }
    }
    bin = obj;
  }

  // add cli.js or "bin/" if they exist
  var dir = path.resolve(process.cwd(), 'bin');
  if (!num && utils.exists(dir)) {
    fs.readdirSync(dir).forEach(function(fp) {
      bin[config.name] = path.relative(process.cwd(), path.join(dir, fp));
      num++;
    });
  }

  if (!num && utils.exists(path.resolve(process.cwd(), 'cli.js'))) {
    bin[config.name] = 'cli.js';
  }

  if (!utils.isEmpty(bin)) {
    config[key] = bin;
    return bin;
  }

  schema.omit(key);
  return;
};
