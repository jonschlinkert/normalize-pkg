'use strict';

var schema = require('./lib/schema');
var utils = require('./lib/utils');
var mapping = {'license': 'licenses'};

/**
 * Normalize package.json with the given `options`
 */

function normalize(pkg, options) {
  options = options || {};
  pkg = pkg || {};

  if (pkg.analyze === false) {
    console.log('normalize-pkg: "analyze: false" is defined in package.json.');
    return pkg;
  }

  pkg = rename(pkg, options.mapping || mapping);

  var defaults = schema(options);
  var opts = utils.merge({}, defaults, options);
  var resolve = utils.expand(opts);
  var keys = Object.keys(opts);
  var diff = utils.omit(pkg, keys);
  var fns = [];

  var ctx = utils.merge({}, pkg);
  utils.define(ctx, 'set', function (key, val) {
    utils.set(this, key, val, options);
    return this;
  });

  for (var key in defaults) {
    if (!pkg.hasOwnProperty(key) && options.extend === false) {
      continue;
    }

    var val = utils.extend({}, defaults[key], options[key]);
    var value = pkg[key];

    if (typeof val.value === 'function') {
      var res = val.value.call(ctx, key, value, pkg);
      if (typeof res === 'function') {
        fns.push({name: key, fn: res});
      } else {
        pkg[key] = res;
      }
    }

    if (!pkg[key]) {
      if (pkg[key] === null) {
        delete pkg[key];
      } if (val.add) {
        pkg[key] = val.value;
      } else if (!pkg[key] && typeof val.default !== 'undefined') {
        pkg[key] = val.default;
      } else {
        delete pkg[key];
      }
    }

    if (pkg[key] && utils.typeOf(pkg[key]) !== val.type) {
      if (val.hasOwnProperty('template')) {
        pkg[key] = resolve(val.template, pkg);
      } else {
        throw new TypeError('expected ' + key + ' to be type: ' + val.type);
      }
    }
  }

  if (fns.length) {
    fns.forEach(function(field) {
      var key = field.name;
      var fn = field.fn;
      fn(key, pkg[key], pkg, defaults);
    });
  }

  // sort keys
  var res = {};
  var len = keys.length;
  var i = -1;

  while (++i < len) {
    var key = keys[i];
    if (pkg.hasOwnProperty(key)) {
      res[key] = pkg[key];
    }
  }
  utils.merge(res, diff);
  return res;
};

function rename(pkg, mapping) {
  for (var key in mapping) {
    var val = mapping[key];
    if (pkg.hasOwnProperty(val)) {
      pkg[key] = pkg[val];
      delete pkg[val];
    }
  }
  return pkg;
}

module.exports = normalize;
