'use strict';

var schema = require('./lib/schema');
var utils = require('./lib/utils');

var mapping = {
  'license': 'licenses'
};

function normalize(config, options) {
  options = options || {};
  config = rename(config, options.mapping || mapping);

  var ctx = utils.extend({}, config);
  ctx.set = function (key, val) {
    utils.set(ctx, key, val);
    return ctx;
  };
  ctx.get = function (key) {
    return utils.get(ctx, key);
  };

  for (var key in schema) {
    if (!config.hasOwnProperty(key) && options.extend === false) {
      continue;
    }

    if (schema.hasOwnProperty(key)) {
      var val = schema[key];

      if (utils.typeOf(config[key]) !== val.type || !config[key]) {
        var value = config[key];

        if (typeof value === 'undefined' && val.add) {
          if (typeof val.value === 'undefined') {
            throw new Error('expected "value" to not be undefined for: ' + key);
          }
          config[key] = val.default || val.value;

        } else if (typeof val.value === 'function') {
          config[key] = val.value.call(ctx, key, config[key], config);

        } else if (val.template) {
          var engine = new utils.Engine(options);
          val.context(config, ctx);
          config[key] = engine.render(val.template, ctx);

        } else if (val.default) {
          config[key] = val.default;

        } else if (val.value) {
          config[key] = val.value;
        }

      } else if (typeof val.value === 'function') {
        var res = val.value.call(ctx, key, config[key], config);
        if (res === null) {
          delete config[key];
        } else {
          config[key] = res;
        }
      }
    }
  }

  return config;
};

function rename(config, mapping) {
  for (var key in mapping) {
    if (mapping.hasOwnProperty(key)) {
      config[key] = config[mapping[key]];
      delete config[mapping[key]];
    }
  }
  return config;
}

module.exports = normalize;