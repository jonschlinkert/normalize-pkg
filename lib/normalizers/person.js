'use strict';

var utils = require('./utils');

/**
 * Stringify a person object, or array of person objects.
 *
 *  - maintainer
 *  - collaborator
 *  - contributor
 *  - author
 *
 * @param {Object} val
 * @return {String}
 */

module.exports = function person(val) {
  if (Array.isArray(val)) {
    return val.map(utils.person);
  }
  if (utils.isObject(val)) {
    return utils.stringify(val);
  }
  if (val && typeof val !== 'string') {
    throw new Error('expected a string');
  }
  return val;
};
