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
require('define-property', 'define');
require('kind-of', 'typeOf');
require('mixin-deep', 'merge');
require('omit-empty');
require('parse-git-config');
require('parse-github-url', 'parseUrl');
require('project-name', 'project');
require('remote-origin-url', 'remote');
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
 * Get the homepage for a repo
 *
 * @param {Object} config
 * @return {String|Null}
 */

utils.homepage = function homepage(repository) {
  if (!/https:\/\/github\.com\//.test(repository)) {
    repository = 'https://github.com/' + repository;
  }
  return utils.stripSlash(repository);
};

/**
 * Create a github repository url
 */

utils.toGithubUrl = function(config) {
  if (!utils.isString(config.repository)) {
    throw new TypeError('expected config.repository to be a string');
  }
  var repo = 'https://github.com/' + config.repository;
  if (!config.homepage) {
    config.homepage = repo;
  }
  if (!config.bugs) {
    config.bugs = { url: repo + '/issues' };
  }
  return repo;
};

/**
 * Create a github repository string from `owner/name`
 */

utils.toRepository = function(owner, name) {
  if (!utils.isString(owner)) {
    throw new TypeError('expected owner to be a string');
  }
  if (!utils.isString(name)) {
    throw new TypeError('expected name to be a string');
  }
  return owner + '/' + name;
};

/**
 * Return true if the given string looks like a github URL.
 *
 * @param {String} `str`
 * @return {Boolean}
 */

utils.parseGithubUrl = function(str, config) {
  if (config.parsedGitHubUrl === true) return config;
  var parsed = utils.omitEmpty(utils.parseUrl(str));
  utils.define(config, 'parsedGitHubUrl', true);

  if (parsed.repository) {
    config.repository = parsed.repository;

  }
  if (parsed.name) {
    config.name = parsed.name;
  }
  return config;
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
