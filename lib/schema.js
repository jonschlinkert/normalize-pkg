'use strict';

var fs = require('fs');
var url = require('url');
var path = require('path');
var utils = require('./utils');

module.exports = {
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
    value: function (key, val, config) {
      if (val && typeof val === 'string') {
        return val;
      }

      if (typeof config.repository === 'string') {
        var parsed = utils.parseUrl(config.repository);
        if (parsed && parsed.repopath) {
          return 'https://github.com/' + parsed.repopath;
        }
      }
    }
  },
  author: {
    type: 'string',
    template: '<%= author.name %> (<%= author.url %>)',
    default: 'Jon Schlinkert (https://github.com/jonschlinkert)',
    value: function (key, val, config) {
      if (val && typeof val === 'string') {
        return val;
      }
      if (val && typeof val === 'object') {
        return utils.stringifyAuthor(val);
      }
    }
  },
  authors: {
    type: 'array',
    value: function (key, val, config) {
      if (Array.isArray(val)) {
        val = val.map(function (ele) {
          return utils.stringifyAuthor(val);
        });
      }
      return val;
    }
  },
  maintainers: {
    type: 'array',
    value: function (key, val, config) {
      if (Array.isArray(val)) {
        val = val.map(function (ele) {
          return utils.stringifyAuthor(val);
        });
      }
      return val;
    }
  },
  contributors: {
    type: 'array',
    value: function (key, val, config) {
      if (Array.isArray(val)) {
        val = val.map(function (ele) {
          return utils.stringifyAuthor(val);
        });
      }
      return val;
    }
  },
  repository: {
    type: 'string',
    template: '<%= author.username %>/<%= name %>',
    value: function(key, val, config) {
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
    },
    context: function (config, ctx) {
      var author = utils.get(config, 'author');
      if (typeof author === 'undefined') {
        return config;
      }

      if (typeof author === 'string') {
        author = utils.parseAuthor(author);
        utils.set(ctx, 'author', author);
      }

      if (typeof author.username === 'undefined') {
        if (!author.url || !isGithubUrl(author.url)) {
          return config;
        }
        var parsed = utils.parseUrl(author.url);
        var username = parsed.user;
        utils.set(ctx, 'author.username', username);
      }
      return config;
    }
  },
  bugs: {
    type: 'object',
    value: {
      url: {
        type: 'string',
        template: 'https://github.com/<%= author.username %>/<%= name %>/issues',
      }
    }
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
      return val;
    }
  },
  files: {
    type: 'array',
    value: function (key, val, config) {
      val = arrayify(val || []);
      if (!val.length) {
        val.push(config.main);
      }
      var files = utils.glob.sync('*.js', {
        ignore: ['*file.js', 'test.js', 'example*']
      });
      if (fs.existsSync('bin')) {
        files.push('bin/');
      }
      if (fs.existsSync('lib')) {
        files.push('lib/');
      }
      val = files.concat(val).sort();
      return utils.unique(val);
    }
  },
  main: {
    type: 'string',
    default: 'index.js'
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
      delete config[key];
    }
  },
  bin: {
    type: 'object',
    value: function (key, val, config) {
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
        delete config[key];
        return null;
      }
      return val;
    }
  },
  devDependencies: {
    type: 'object',
    value: function (key, obj, config) {
      if (obj && typeof obj === 'object') {
        for (var key in obj) {
          var val = obj[key];

          if (/verb-tag/.test(key)) {
            delete obj[key];
          } else if (key === 'verb') {
            val = val.replace(/^\W+/, '');
            if (utils.semver.lt(val, '8.0.0')) {
              delete obj[key];
            }
          }
        }
      }

      if (fs.existsSync('verbfile.js')) {
        obj.verb = '^0.9.0';
      }

      if (!Object.keys(obj).length) {
        delete config[key];
        return null;
      }
      return obj;
    }
  },
  keywords: {
    type: 'array',
    value: function (key, val, config) {
      if (Array.isArray(val) && val.length) {
        val.sort();
      }
      return val;
    }
  },
  verb: {
    type: 'object',
    add: true,
    value: {
      related: {
        description: '',
        list: []
      }
    }
  }
};

function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}

function isGithubUrl(str) {
  var obj = url.parse(str);
  var hosts = ['github.com', 'github.io', 'gist.github.com'];
  return hosts.indexOf(obj.host) > -1;
}
