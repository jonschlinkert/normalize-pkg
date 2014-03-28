const log = require('verbalize');
log.runner = 'normalize-pkg';


/**
 * Return `true` if the given string contains a string.
 *
 * @param   {String}  haystack
 * @param   {String}  needle
 *
 * @return  {Boolean}
 */

var contains = exports.contains = function(haystack, needle) {
  return !!~haystack.search(needle);
};


/**
 * Infer the correct license url based on the given string.
 * This should probably also normalize `type`
 *
 * @param   {[type]}  str  [description]
 *
 * @return  {[type]}       [description]
 */

exports.inferLicenseURL = function(str) {
  var type = str, url = '';

  if (contains(str, 'MIT')) {
    url = 'http://opensource.org/licenses/MIT';
  }

  if (contains(str, 'Apache')) {
    url = 'http://www.apache.org/licenses/LICENSE-2.0.html';
  }

  if (contains(str, 'GPL')) {
    if (contains(str, '2')) {
      url = 'http://www.gnu.org/licenses/gpl-2.0.txt';
    }
    if (contains(str, '3')) {
      url = 'http://www.gnu.org/licenses/gpl-3.0.txt';
    }
  }

  return {
    type: type,
    url: url
  };
};


/**
 * Logging
 */

exports.msg = {
  isCorrect: function (val) {
    return log.verbose.run(val, log.green('OK'));
  },

  isMalformed: function (val) {
    return log.verbose.error('package.json seems malformed. Cannot determine the status of `' + val + '`');
  },

  isMissing: function (val) {
    return log.verbose.warn('  normalize-pkg [' + val + ']', log.sep, log.red('missing'));
  },

  fixingProperty: function (val) {
    return log.verbose.warn('  normalize-pkg [' + val + ']', log.sep, log.green('fixed'));
  },

  addingProperty: function (val) {
    return log.verbose.success('  normalize-pkg [' + val + ']', log.sep, log.green('added'));
  }
};
