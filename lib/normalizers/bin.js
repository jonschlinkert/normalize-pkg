'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(bin, key, config, schema) {
  var opts = utils.extend({}, schema.options);

  if (opts.bin === false) {
    schema.omit(key);
    return;
  }

  if (typeof bin === 'undefined') {
    bin = {};
  }

  // add cli.js or "bin/" if they exist
  addPath(bin, 'cli.js', config.name, opts);
  addPath(bin, 'bin/', config.name, opts);

  if (typeof bin === 'string') {
    var obj = {};
    obj[config.name] = bin;
    bin = obj;
  }

  var obj = {};
  var num = 0;

  if (utils.isObject(bin)) {
    for (var prop in bin) {
      if (utils.exists(bin[prop])) {
        obj[prop] = bin[prop];
        num++;
      }
    }
  }

  if (!utils.isEmpty(obj)) {
    config[key] = obj;
    return obj;
  }

  schema.omit(key);
  return;
};

function addPath(bin, file, name, opts) {
  if (utils.exists(path.resolve(process.cwd(), file))) {
    bin[name] = file;
  }
}
