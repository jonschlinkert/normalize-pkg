'use strict';

var Emitter = require('component-emitter');
var schema = require('./lib/schema');
var utils = require('./lib/utils');

function Normalizer(options) {
  this.options = options || {};
  this.schema = schema(this.options);
  this.data = this.schema.data;
  this.schema.on('warning', this.emit.bind(this, 'warning'));
  this.schema.on('error', this.emit.bind(this, 'error'));
}

/**
 * Inherit `Emitter`
 */

Emitter(Normalizer.prototype);

/**
 * Add a `field` to the schema.
 *
 * @param {Object} `field`
 * @return {Object} Returns the instance
 * @api public
 */

Normalizer.prototype.field = function(field) {
  this.schema.field(...arguments);
  return this;
};

/**
 * Iterate over `pkg` properties and normalize values with
 * fields on the scheman.
 *
 * @param {Object} `pkg` The `package.json` object to normalize
 * @param {Object} `options`
 * @return {Object} Returns a normalized package.json object.
 * @api public
 */

Normalizer.prototype.normalize = function(pkg, options) {
  if (typeof pkg === 'string') {
    pkg = utils.requirePackage(pkg);
  }
  return this.schema.normalize(pkg, options);
};

/**
 * Normalizer
 */

module.exports = Normalizer;
