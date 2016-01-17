'use strict';

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

require('extend-shallow', 'extend');
require('isobject', 'isObject');
require('parse-github-url', 'parseUrl');
require('remote-origin-url', 'remote');
require('stringify-author', 'stringify');
require('try-open');
require = fn;

/**
 * Returns true if a filepath exists on the file system.
 */

utils.exists = function exists(filepath) {
  return !!utils.tryOpen(filepath, 'r');
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
 * Return true if the given string looks like a github URL.
 *
 * @param {String} `str`
 * @return {Boolean}
 */

utils.isGithubUrl = function isGithubUrl(str) {
  var hosts = ['github.com', 'github.io', 'gist.github.com'];
  return hosts.indexOf(url.parse(str).host) > -1;
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
