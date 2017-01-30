'use strict';

var utils = require('./utils');
var keys = require('./keys');

module.exports = function(config, schema) {
  if (schema.isMerged) return;

  schema.checked = schema.checked || {};
  schema.isMerged = true;

  // shallow clone schema.data
  var schemaOpts = utils.pick(schema.options, keys);
  var data = utils.extend({}, schema.data);
  var obj = utils.merge({}, config, data, schemaOpts);
  utils.merge(config, obj);
};
