'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(files, key, config, schema) {
  files = utils.arrayify(files).filter(Boolean);
  files = utils.union([], files, config.files);
  var opts = utils.extend({}, schema.options);

  var len = files.length;
  var idx = -1;
  var res = Array.isArray(opts.files) ? opts.files : [];

  while (++idx < len) {
    var file = files[idx];
    if (utils.exists(file)) {
      utils.union(res, file);
    }
  }

  // commond directories
  addPath(res, 'lib/', opts);
  addPath(res, 'dist/', opts);
  addPath(res, 'bin/', opts);

  // common files
  addPath(res, 'index.js', opts);
  addPath(res, 'utils.js', opts);
  addPath(res, 'cli.js', opts);

  if (res.length) {
    res.sort();
    config[key] = res;
    return res;
  }

  // don't use `omit`, so the key can be re-added if needed
  delete config[key];
  return;
};

function addPath(files, file, opts) {
  if (utils.isObject(opts.files) && opts.files[file] === false) {
    return;
  }
  if (Array.isArray(opts.files) && opts.files.indexOf(file) === -1) {
    return;
  }
  if (files.indexOf(file) !== -1) {
    return;
  }
  if (utils.exists(path.resolve(process.cwd(), file))) {
    utils.union(files, file);
  }
}
