'use strict';

var schema = require('./lib/schema');
var utils = require('./lib/utils');

function normalize(config, options) {
  for (var key in schema) {
    if (schema.hasOwnProperty(key)) {
      var val = schema[key];

      if (utils.typeOf(config[key]) !== val.type) {
        var value = config[key];

        if (typeof value === 'undefined' && val.add) {
          if (typeof val.value === 'undefined') {
            throw new Error('expected "value" to not be undefined for: ' + key);
          }
          config[key] = val.value;

        } else if (typeof val.value === 'function') {
          config[key] = val.value(config[key], config);

        } else if (val.value) {
          config[key] = val.value;

        } else if (val.template) {
          var engine = new utils.Engine(options);
          var ctx = utils.extend({}, config);
          val.context(config, ctx);
          config[key] = engine.render(val.template, ctx);
        }
      }
    }
  }

  return config;
};

module.exports = normalize;