'use strict';

var fs = require('fs');
var url = require('url');
var path = require('path');
var utils = require('./utils');

module.exports = function (options) {
  options = options || {};

  return {
    name: {
      type: 'string',
      value: function (key, val, config) {
        return val || utils.projectName(process.cwd());
      }
    },
    description: {
      type: 'string',
      value: ''
    },
    version: {
      type: 'string',
      default: '0.1.0'
    },
    homepage: {
      type: 'string',
      value: function fn(key, val, config, schema) {
        if (val && typeof val === 'string') {
          return val;
        }

        if (typeof config.repository === 'string') {
          var parsed = utils.parseUrl(config.repository);
          if (parsed && parsed.repopath) {
            config[key] = 'https://github.com/' + parsed.repopath;
            return config[key];
          }
        }
        return fn;
      }
    },
    author: {
      type: 'string',
      value: function (key, val, config) {
        if (val && typeof val === 'string') {
          return val;
        }
        if (val && typeof val === 'object') {
          return utils.stringifyAuthor(val);
        }
        if (typeof val === 'undefined') {
          return null;
        }
        return val;
      }
    },
    authors: {
      type: 'array',
      value: people
    },
    maintainers: {
      type: 'array',
      value: people
    },
    contributors: {
      type: 'array',
      value: people
    },
    collaborators: {
      type: 'array',
      value: people
    },
    repository: {
      type: 'string',
      template: '<%= author.username %>/<%= name %>',
      value: function (key, val, config) {
        if (val && typeof val === 'string') {
          return val;
        }
        var parsed = {};
        if (!val) {
          var str = utils.remote.sync();
          parsed = utils.parseUrl(str);
        } else if (typeof val === 'object' && val.url) {
          parsed = utils.parseUrl(val.url);
        }

        this.set('name', parsed.repo);
        this.set('author.username', parsed.user);
        this.set('repository', parsed.repopath);
        this.set('branch', parsed.branch);
        return parsed.repopath;
      }
    },
    bugs: {
      type: 'string',
      value: function (key, val, config, options) {
        if (!val) return null;
        if (typeof val === 'object') {
          return val.url;
        }
        return val;
      },
    },
    license: {
      type: 'string',
      default: 'MIT',
      value: function (key, val, config) {
        if (typeof val === 'string') {
          return val;
        }
        if (Array.isArray(val)) {
          return val[0].type;
        }
        if (val && typeof val === 'object' && val.type) {
          return val.type;
        }
        return val;
      }
    },
    licenses: {
      type: 'string',
      value: function (key, val, config) {
        if (typeof val === 'string') {
          config.license = val;
          return null;
        }
        if (Array.isArray(val)) {
          config.license = val[0].type;
          return null;
        }
        if (val && typeof val === 'object' && val.type) {
          config.license = val.type;
          return null;
        }
        return null;
      }
    },
    files: {
      type: 'array',
      value: function (key, val, config) {
        val = arrayify(val || []);

        if (!val.length && config.main) {
          val.push(config.main);
        }

        if (options.files !== true) {
          return val;
        }

        var files = utils.glob.sync('*.js', {
          ignore: ['*file.js', 'test.js', 'example*']
        });

        if (fs.existsSync('bin')) {
          files.push('bin');
        }
        if (fs.existsSync('dist')) {
          files.push('dist');
        }
        if (fs.existsSync('lib')) {
          files.push('lib');
        }

        val = files.concat(val);
        val = val.reduce(function (acc, name) {
          if (!name) return acc;
          if (name && name[name.length - 1] === '/') {
            name = name.slice(0, -1);
          }
          var fp = path.resolve(name);
          if (fp && fs.existsSync(fp)) {
            acc.push(name);
          }
          return acc;
        }, []);

        config[key] = utils.unique(val);
        return config[key];
      }
    },
    main: {
      type: 'string',
      value: function (key, val, config) {
        if (val && typeof val === 'string') {
          if (val === 'index.js') {
            return val;
          }
          if (!fs.existsSync(val)) {
            return null;
          }
        }
        return val;
      }
    },
    engines: {
      type: 'object'
    },
    scripts: {
      type: 'object',
      value: function (key, val, config) {
        if (typeof val === 'object' && val.test) {
          if (val.test === 'mocha -R spec') {
            val.test = 'mocha';
          }
          return val;
        }
      }
    },
    preferGlobal: {
      type: 'boolean',
      value: function (key, val, config) {
        if (fs.existsSync(path.resolve('./bin'))) {
          return true;
        }
        if (fs.existsSync(path.resolve('cli.js'))) {
          return true;
        }
        return null;
      }
    },
    bin: {
      type: 'object',
      value: function (key, val, config) {
        if (!val) return;

        if (val && typeof val === 'object') {
          for (var name in val) {
            if (val.hasOwnProperty(name)) {
              var fp = val[name];
              if (!fs.existsSync(fp)) {
                throw new Error('package.json bin > ' + fp + ' does not exist');
              }
            }
          }
        }
        return val;
      }
    },
    dependencies: {
      type: 'object',
      value: function (key, val, config) {
        if (!val) return;

        // fix common mistakes
        if (val.mocha) {
          utils.set(config, 'devDependencies.mocha', val.mocha);
          delete val.mocha;
        }
        if (val.should) {
          utils.set(config, 'devDependencies.should', val.should);
          delete val.should;
        }
        if (val.chai) {
          utils.set(config, 'devDependencies.chai', val.chai);
          delete val.chai;
        }
        if (!Object.keys(val).length) {
          return null;
        }
        return val;
      }
    },
    devDependencies: {
      type: 'object',
      value: function (key, obj, config) {
        if (obj && typeof obj === 'object') {
          for (var prop in obj) {
            var val = obj[prop];

            if (/verb-tag/.test(prop)) {
              delete obj[prop];
            } else if (prop === 'verb') {
              val = val.replace(/^\W+/, '');
              if (utils.semver.lt(val, '8.0.0')) {
                delete obj[prop];
              }
            }
          }

          if (obj.hasOwnProperty('mocha')) {
            obj.mocha = '*';
          }

          if (obj.hasOwnProperty('should')) {
            obj.should = '*';
          }

          if (!Object.keys(obj).length) {
            return null;
          }
        }
        return obj;
      }
    },
    keywords: {
      type: 'array',
      value: function (key, val, config) {
        if (typeof val === 'undefined') {
          var segs = config.name.split(/\W+/);
          if (segs.length > 1) {
            config[key] = segs;
            return segs;
          }
        }
        if (Array.isArray(val) && val.length) {
          val.sort();
        }
        if (!val || !val.length) return null;
        return val;
      }
    },
    verb: {
      type: 'object',
      add: true,
      value: function (key, value, config) {
        var obj = {
          related: {
            list: []
          }
        };
        return utils.merge({}, obj, value);
      }
    }
  };
};

function people(key, val, config) {
  if (Array.isArray(val)) {
    val = val.map(function (ele) {
      if (typeof ele === 'string') return ele;
      return utils.stringifyAuthor(ele);
    });
  }
  if (typeof val === 'undefined') {
    delete config[key];
    return null;
  }
  return val;
}

function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}

function isGithubUrl(str) {
  var obj = url.parse(str);
  var hosts = ['github.com', 'github.io', 'gist.github.com'];
  return hosts.indexOf(obj.host) > -1;
}
