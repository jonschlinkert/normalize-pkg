'use strict';

var fs = require('fs');
var url = require('url');

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
require('extend-shallow', 'extend');
require('isobject', 'isObject');
require('parse-github-url', 'parseUrl');
require('project-name', 'project');
require('remote-origin-url', 'remote');
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
 * Cast `val` to an array
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Get the homepage for a repo
 *
 * @param {Object} config
 * @return {String|Null}
 */

utils.homepage = function homepage(repository) {
  return 'https://github.com/' + utils.stripSlash(repository);
};

/**
 * Strip a trailing slash from a string.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.stripSlash = function stripSlash(str) {
  return str.replace(/\/$/, '');
};

/**
 * Expose `utils`
 */

module.exports = utils;
