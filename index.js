'use strict';

var Schema = require('map-schema');
var normalizers = require('./lib/normalizers');
var validators = require('./lib/validators');
var utils = require('./lib/utils');
var keys = require('./lib/keys');

/**
 * Normalize package.json using a schema.
 */

module.exports = function(options) {
  var opts = utils.extend({keys: keys}, options);
  var schema = new Schema(opts);

  schema
    .field('name', ['string'], {
      normalize: normalizers.name,
      required: true
    })
    .field('private', 'boolean')
    .field('description', 'string')
    .field('version', 'string', {
      default: '0.1.0',
      required: true
    })
    .field('homepage', 'string', {
      normalize: normalizers.homepage
    })

    /**
     * Peson fields
     */

    .field('author', ['object', 'string'], { normalize: normalizers.person })
    .field('authors', 'array', { normalize: normalizers.person })
    .field('maintainers', 'array', { normalize: normalizers.person })
    .field('contributors', 'array', { normalize: normalizers.person })
    .field('collaborators', 'array', { normalize: normalizers.person })

    /**
     * Bugs, repo and license
     */

    .field('bugs', ['object', 'string'])
    .field('repository', ['object', 'string'], {
      normalize: normalizers.repository
    })
    .field('license', 'string', {
      normalize: normalizers.license,
      default: 'MIT'
    })
    .field('licenses', ['array', 'object'], {
      normalize: normalizers.licenses,
      validate: validators.licenses
    })

    /**
     * Files, main
     */

    .field('files', 'array', { validate: validators.files })
    .field('main', 'string', {
      normalize: normalizers.main,
      validate: function(filepath) {
        return utils.exists(filepath);
      }
    })

    /**
     * Engine
     */

    .field('engines', 'object', {
      default: '>= 0.10.0'
    })
    .field('engine-strict', 'boolean')
    .field('engineStrict', 'boolean', {
      normalize: function(val, key, config, schema) {
        config['engine-strict'] = val;
        delete config[key];
        return val;
      }
    })

    /**
     * Scripts, binaries and related
     */

    .field('bin', ['object', 'string'], { validate: validators.bin })
    .field('preferGlobal', 'boolean', { validate: validators.preferGlobal })
    .field('scripts', 'object', { normalize: normalizers.scripts })

    /**
     * Dependencies
     */

    .field('dependencies', 'object')
    .field('devDependencies', 'object')
    .field('peerDependencies', 'object')
    .field('optionalDependencies', 'object')

    /**
     * Project metadata
     */

    .field('keywords', 'array', { normalize: normalizers.keywords })
    .field('man', ['array', 'string'])

  // Add fields defined on the options
  schema.addFields(opts);
  return schema;
};
