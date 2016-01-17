'use strict';

var Schema = require('reconcile');
var normalizers = require('./lib/normalizers');
var validators = require('./lib/validators');
var utils = require('./lib/utils');

// module.exports = function(config, options) {
//   var keys = Object.keys(config);
//   var opts = utils.extend({keys: keys, defaults: true}, options);
//   var res = pkgSchema(opts);
//   console.log(res.normalize)
//   return res;
// };

module.exports = function pkgSchema(options) {
  var schema = new Schema(options);

  schema.field('name', 'string', {
      required: true,
      normalize: function(val, key, config) {
        if (!val && this.data.name) {
          return this.data.name;
        }
        this.update('homepage', config);
        return this.data.name;
      }
    })
    .field('private', 'boolean')
    .field('description', 'string')
    .field('version', 'string', {
      default: '0.1.0',
      required: true
    })
    .field('homepage', 'string', { normalize: normalizers.homepage })
    .field('author', ['object', 'string'], { normalize: utils.person })
    .field('authors', 'array', { normalize: utils.person })
    .field('maintainers', 'array', { normalize: utils.person })
    .field('contributors', 'array', { normalize: utils.person })
    .field('collaborators', 'array', { normalize: utils.person })

    .field('bugs', ['object', 'string'])
    .field('repository', ['object', 'string'], {
      normalize: function(val, key, config, schema) {
        if (!val && !this.data.repository) {
          val = utils.remote.sync();
          this.data.set('repository', val);
        }
        return utils.isObject(val) ? val.url : val;
      }
    })

    .field('license', 'string', {
      default: 'MIT'
    })
    .field('licenses', ['array', 'object'], {
      validate: function(val, key, config, schema) {
        schema.error(key, 'Field is deprecated. Define "license" as a string instead.');
      },
      normalize: function(val, key, config, schema) {
        if (Array.isArray(val)) {
          schema.update('license', val[0].type, config);
          schema.omit(key);
        }
      }
    })

    .field('files', 'array', {
      validate: validators.files
    })
    .field('main', 'string', {
      validate: function(filepath) {
        return utils.exists(filepath);
      }
    })

    .field('engines', 'object', {
      default: '>= 0.10.0'
    })
    .field('engine-strict', 'boolean')
    .field('engineStrict', 'boolean', {
      validate: function(val, key, config, schema) {
        schema.error(key, 'deprecated with npm v3.0');
      }
    })

    .field('preferGlobal', 'boolean')
    .field('scripts', 'object')
    .field('bin', ['object', 'string'])
    .field('man', ['array', 'string'])

    .field('dependencies', 'object')
    .field('devDependencies', 'object')
    .field('peerDependencies', 'object')
    .field('optionalDependencies', 'object')
    .field('keywords', 'array');

  options = options || {};
  if (options.fields) {
    schema.visit('field', options.fields);
  }
  return schema;
};

// function verbSchema(options) {
//   var schema = new Schema(options)
//     .field('layout', ['object', 'string', 'null'])
//     .field('related', ['array', 'object'])
//     .field('reflinks', ['array', 'object'])
//     .field('plugins', ['array', 'object'], {
//       normalize: function(val) {
//         if (typeof val === 'string') {
//           return [val];
//         }
//         return val;
//       }
//     });

//   return schema;
// }
    // .field('verb', 'object', verbSchema({
    //   keys: [
    //     'layout',
    //     'options',
    //     'data',
    //     'plugins',
    //     'helpers',
    //     'related',
    //     'reflinks'
    //   ]
    // }))
