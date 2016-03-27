'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(files, key, config, schema) {
  files = utils.arrayify(files).filter(Boolean);
  files = utils.union([], files, config.files);
  var opts = utils.merge({}, schema.options);

  var len = files.length;
  var idx = -1;
  var res = Array.isArray(opts.files) ? opts.files : [];

  while (++idx < len) {
    var file = files[idx];
    if (utils.exists(path.resolve(process.cwd(), file))) {
      utils.union(res, utils.stripSlash(file));
    }
  }

  // commond directories
  addPath(res, 'lib', opts, config);
  addPath(res, 'dist', opts, config);
  addPath(res, 'bin', opts, config);

  // common files
  addPath(res, 'index.js', opts, config);
  addPath(res, 'utils.js', opts, config);
  addPath(res, 'cli.js', opts, config);

  if (res.length) {
    res.sort();
    config[key] = res;
    schema.update('bin', config);
    return res;
  }

  // don't use `omit`, so the key can be re-added if needed
  delete config[key];
  return;
};

function addPath(files, file, opts, config) {
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
