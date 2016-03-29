'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Module depedencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module depedencies
 */

require('arr-union', 'union');
require('array-unique', 'unique');
require('kind-of', 'typeOf');
require('mixin-deep', 'merge');
require('omit-empty');
require('parse-git-config');
require('repo-utils', 'repo');
require('resolve-dir');
require('semver');
require('stringify-author', 'stringify');
require = fn;

/**
 * Return true if `fp` exists on the file system
 */

utils.exists = function(fp) {
  try {
    fs.statSync(fp);
    return true;
  } catch (err) {};
  return false;
};

/**
 * Return true if `val` is empty
 */

utils.isEmpty = function(val) {
  return Object.keys(utils.omitEmpty(val)).length === 0;
};

/**
 * Return true if `val` is an object
 */

utils.isObject = function(val) {
  return utils.typeOf(val) === 'object';
};

/**
 * Return true if `val` is a string with a non-zero length
 */

utils.isString = function(val) {
  return val && typeof val === 'string';
};

/**
 * Cast `val` to an array
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Return true if `fp` exists on the file system
 */

utils.requirePackage = function(fp) {
  fp = path.resolve(fp);
  try {
    var stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      fp = path.join(fp, 'package.json');
    } else if (!/package\.json$/.test(fp)) {
      fp = path.join(path.dirname(fp), 'package.json');
    }
    return require(fp);
  } catch (err) {};
  return {};
};

/**
 * Strip a trailing slash from a string.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.stripSlash = function stripSlash(str) {
  return str.replace(/\W+$/, '');
};

/**
 * Expose `utils`
 */

module.exports = utils;
