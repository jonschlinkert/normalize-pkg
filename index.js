'use strict';

var schema = require('./lib/schema');
var utils = require('./lib/utils');
var mapping = {'license': 'licenses'};

/**
 * Normalize package.json with the given `options`
 */

function normalize(config, options) {
  var keys = Object.keys(schema);
  var diff = utils.omit(config, keys);
  var fns = [];

  options = options || {};
  config = rename(config, options.mapping || mapping);
  if (config.analyze === false) {
    console.log('stopping early, "analyze: false" is defined in package.json.');
    return config;
  }

  var ctx = utils.extend({}, config);
  ctx.set = function(key, val) {
    utils.set(ctx, key, val);
    return ctx;
  };

  for (var key in schema) {
    if (!config.hasOwnProperty(key) && options.extend === false) {
      continue;
    }

    var val = schema[key];
    var value = config[key];

    if (typeof val.value === 'function') {
      var res = val.value.call(ctx, key, value, config, schema);
      if (typeof res === 'function') {
        fns.push({name: key, fn: res});
      } else {
        config[key] = res;
      }
    }

    if (!config[key]) {
      if (config[key] === null) {
        delete config[key];
      } if (val.add) {
        config[key] = val.value;
      } else if (!config[key] && typeof val.default !== 'undefined') {
        config[key] = val.default;
      } else {
        delete config[key];
      }
    }

    if (config[key] && utils.typeOf(config[key]) !== val.type) {
      throw new TypeError('expected ' + key + ' to be type: ' + val.type);
    }
  }

  if (fns.length) {
    fns.forEach(function(field) {
      var key = field.name;
      var fn = field.fn;
      fn(key, config[key], config, schema);
    });
  }

  // sort keys
  var res = {};
  var len = keys.length;
  var i = -1;

  while (++i < len) {
    var key = keys[i];
    if (config.hasOwnProperty(key)) {
      res[key] = config[key];
    }
  }
  utils.extend(res, diff);
  return res;
};

function rename(config, mapping) {
  for (var key in mapping) {
    var val = mapping[key];
    if (config.hasOwnProperty(val)) {
      config[key] = config[val];
      delete config[val];
    }
  }
  return config;
}

module.exports = normalize;
