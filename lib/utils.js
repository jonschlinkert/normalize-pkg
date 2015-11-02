'use strict';

/**
 * Lazily-required module dependencies (makes the application
 * faster)
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('object.omit', 'omit');
require('array-unique', 'unique');
require('project-name');
require('parse-author');
require('stringify-author');
require('mixin-deep', 'merge');
require('remote-origin-url', 'remote');
require('parse-github-url', 'parseUrl');
require('extend-shallow', 'extend');
require('kind-of', 'typeOf');
require('matched', 'glob');
require('get-value', 'get');
require('set-value', 'set');
require('semver');

require('ansi-red', 'red');
require('ansi-cyan', 'cyan');
require('ansi-gray', 'gray');
require('ansi-green', 'green');
require('ansi-yellow', 'yellow');

/**
 * Restore `require`
 */

require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
