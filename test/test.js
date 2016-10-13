'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var Normalizer = require('..');
var createRepo = require('./support/git');
var del = require('delete');
var config;

var origCwd = process.cwd();
var remote = 'https://github.com/jonschlinkert/test-project.git';
var project = path.resolve(__dirname, 'fixtures/project');
var git = path.resolve(project, '.git');

describe('normalize', function() {
  beforeEach(function() {
    config = new Normalizer({verbose: false});
  });

  before(function(cb) {
    process.chdir(project);
    createRepo(project, remote, cb);
  });

  after(function(cb) {
    process.chdir(origCwd);
    del(git, cb);
  });

  describe('Normalizer', function() {
    it('should instantiate without new', function() {
      config = Normalizer({foo: 'bar'});
      assert.equal(config.options.foo, 'bar');
    });

    it('should instantiate with an options object', function() {
      config = new Normalizer({foo: 'bar'});
      assert.equal(config.options.foo, 'bar');
    });

    it('should instantiate without an options object', function() {
      config = new Normalizer();
      assert.deepEqual(config.options, {});
    });
  });

  describe('.field', function() {
    it('should add a custom field', function() {
      config = new Normalizer({omit: 'version'});
      config.field('foo', 'string', {
        normalize: function(val, key, config, schema) {
          config[key] = {a: 'b'};
          return config[key];
        }
      });

      var res = config.normalize({});
      assert.equal(res.foo.a, 'b');
    });

    it('should convert a function to a `normalize` function', function() {
      config = new Normalizer({omit: 'version'});
      config.field('foo', 'string', function(val, key, config, schema) {
        config[key] = {a: 'b'};
        return config[key];
      });

      var res = config.normalize({});
      assert.equal(res.foo.a, 'b');
    });

    it('should remove an array of fields on options.omit', function() {
      config = new Normalizer({omit: ['version', 'main']});
      var res = config.normalize({});
      assert.equal(typeof res.version, 'undefined');
      assert.equal(typeof res.main, 'undefined');
    });

    it('should extend an existing field', function() {
      config = new Normalizer({knownOnly: true});
      config.schema.fields = {};

      config.field('foo', 'string', {
        normalize: function(val) {
          return val + ':bar';
        }
      });

      config.field('foo', 'string', {
        extend: true,
        default: 'foo'
      });

      var res = config.normalize({});
      assert.equal(res.foo, 'foo:bar');
    });
  });

  describe('options.omit', function() {
    it('should remove a field on options.omit', function() {
      config = new Normalizer({omit: 'version'});
      var res = config.normalize({});
      assert.equal(typeof res.version, 'undefined');
    });

    it('should remove an array of fields on options.omit', function() {
      config = new Normalizer({omit: ['version', 'main']});
      var res = config.normalize({});
      assert.equal(typeof res.version, 'undefined');
      assert.equal(typeof res.main, 'undefined');
    });
  });

  describe('defaults', function() {
    it('should add default properties to config', function() {
      var res = config.normalize({});
      assert.equal(res.name, 'test-project');
      assert.equal(res.version, '0.1.0');
    });
  });

  describe('package.json', function() {
    it('should get package.json when no args are passed', function() {
      var res = config.normalize();
      assert.equal(res.name, 'test-project');
    });

    it('should get package.json from a cwd', function() {
      var res = config.normalize(process.cwd());
      assert.equal(res.name, 'test-project');
    });

    it('should get the cwd when dir exists but path does not exist', function() {
      var res = config.normalize(path.resolve(process.cwd(), 'index.js'));
      assert.equal(res.name, 'test-project');
    });

    it('should get the cwd from a file path', function() {
      var res = config.normalize(path.resolve(process.cwd(), 'main.js'));
      assert.equal(res.name, 'test-project');
    });
  });

  describe('name', function() {
    it('should use the defined project name', function() {
      var pkg = { name: 'foo' };
      var res = config.normalize(pkg);
      assert(res.name);
      assert.equal(res.name, 'foo');
    });

    it('should get the project name when string is empty', function() {
      var pkg = { name: '' };
      var res = config.normalize(pkg);
      assert(res.name);
      assert.equal(res.name, 'test-project');
    });

    it('should get the project name when missing', function() {
      var pkg = {};
      var res = config.normalize(pkg);
      assert(res.name);
      assert.equal(res.name, 'test-project');
    });

    it('should use the normalize function defined on options', function() {
      var pkg = { name: 'foo' };
      var opts = {
        fields: {
          name: {
            type: ['string'],
            normalize: function custom() {
              return 'bar';
            }
          }
        }
      };

      var res = config.normalize(pkg, opts);
      assert(res.name);
      assert.equal(res.name, 'bar');
    });
  });

  describe('version', function() {
    it('should use the given version', function() {
      var pkg = {version: '1.0.0'};
      var res = config.normalize(pkg);
      assert(res.version);
      assert.equal(res.version, '1.0.0');
    });

    it('should use the default version', function() {
      var pkg = {version: ''};
      var res = config.normalize(pkg);
      assert(res.version);
      assert.equal(res.version, '0.1.0');
    });

    it('should emit a warning when version type is invalid', function(cb) {
      var pkg = {version: 5};
      var count = 0;

      config.on('warning', function(method, key, err) {
        if (key === 'version') {
          count++;
        }
      });

      config.normalize(pkg);
      assert.equal(count, 1);
      cb();
    });

    it('should throw an error when version is invalid', function(cb) {
      var pkg = {version: 'foo'};
      try {
        config.normalize(pkg);
        cb(new Error('expected an error'));
      } catch (err) {
        assert(/invalid semver/.test(err.message));
        cb();
      }
    });
  });

  describe('main', function() {
    it('should remove the property if the file does not exist', function() {
      var pkg = { main: 'foo.js' };
      var res = config.normalize(pkg);
      assert(!res.hasOwnProperty('main'));
    });

    it('should not remove the property if the file exists', function() {
      var pkg = { main: 'main.js' };
      var res = config.normalize(pkg);
      assert(res.hasOwnProperty('main'));
    });

    it('should add the main file to the `files` array', function() {
      var pkg = { main: 'main.js' };
      var res = config.normalize(pkg);
      assert.equal(res.files.indexOf('main.js'), 0);
    });

    it('should not add main file to files array when main file does not exist', function() {
      var pkg = {
        files: [],
        main: 'index.js'
      };

      var res = config.normalize(pkg);
      assert(!res.hasOwnProperty('files'));
    });

    it('should add main file to files array if files array is empty', function() {
      var pkg = {
        files: [],
        main: 'main.js'
      };

      var res = config.normalize(pkg);
      assert.equal(res.files.length, 1);
      assert.equal(res.files[0], 'main.js');
    });

    it('should create files array with main if undefined', function() {
      var pkg = {
        main: 'main.js'
      };

      var res = config.normalize(pkg);
      assert(res.files.length);
      assert(res.files.indexOf('main.js') !== -1);
    });

    it('should not double add the file to files', function() {
      var pkg = {
        files: ['main.js'],
        main: 'main.js'
      };

      var res = config.normalize(pkg);
      assert.equal(res.files.length, 1);
      assert(res.files.indexOf('main.js') !== -1);
    });

    it('should remove main if the file does not exist', function() {
      var pkg = { main: 'foo.js' };

      var res = config.normalize(pkg);
      assert(!res.main);
    });

    it('should do nothing if not defined', function() {
      var pkg = {};

      var res = config.normalize(pkg);
      assert.equal(typeof res.main, 'undefined');
    });
  });

  describe('files', function() {
    it('should remove a file if it does not exist', function() {
      var pkg = { files: ['foo.js', 'main.js'] };
      var res = config.normalize(pkg);
      assert.equal(res.files.length, 1);
    });

    it('should use `options.files`', function() {
      var res = config.normalize({}, {files: ['main.js']});
      assert.equal(res.files.length, 1);
    });

    it('should remove the files array if it\'s empty', function() {
      var pkg = { files: [] };
      var res = config.normalize(pkg);
      assert(!res.files);
    });

    it('should remove the files array if a file that does not exist is removed', function() {
      var pkg = { files: ['foo.js'] };
      var res = config.normalize(pkg);
      assert(!res.files);
    });
  });

  describe('homepage', function() {
    it('should add a homepage from git repository', function() {
      var res = config.normalize({});
      assert(res.homepage);
      assert.equal(res.homepage, 'https://github.com/jonschlinkert/test-project');
    });

    it('should add repository when setting homepage', function() {
      var res = config.normalize({});
      assert(res.homepage);
      assert.equal(res.repository, 'jonschlinkert/test-project');
    });

    it('should use the given homepage', function() {
      var pkg = {homepage: 'https://github.com/assemble/assemble'};
      var res = config.normalize(pkg);
      assert(res.homepage);
      assert.equal(res.homepage, 'https://github.com/assemble/assemble');
    });

    it('should get homepage from repository.url', function() {
      var pkg = {
        homepage: '',
        repository: 'git://github.com/jonschlinkert/test-project.git'
      };

      var res = config.normalize(pkg);
      assert(res.homepage);
      assert.equal(res.homepage, 'https://github.com/jonschlinkert/test-project');
    });
  });

  describe('author', function() {
    it('should not add an empty author field', function() {
      var res = config.normalize({});
      assert(!res.hasOwnProperty('author'));
    });

    it('should not add an empty authors field', function() {
      var res = config.normalize({});
      assert(!res.hasOwnProperty('authors'));
    });

    it('should use the given author as a string', function() {
      var pkg = { author: 'Jon Schlinkert' };
      var res = config.normalize(pkg);
      assert(res.author);
      assert.equal(res.author, 'Jon Schlinkert');
    });

    it('should convert an author object to a string', function() {
      var pkg = {
        author: {
          name: 'Jon Schlinkert',
          url: 'https://github.com/jonschlinkert'
        }
      };

      var res = config.normalize(pkg);
      assert(res.author);
      assert.equal(res.author, 'Jon Schlinkert (https://github.com/jonschlinkert)');
    });
  });

  describe('maintainers', function() {
    it('should not add an empty maintainers field', function() {
      var res = config.normalize({});
      assert(!res.hasOwnProperty('maintainers'));
    });
  });

  describe('license', function() {
    it('should add MIT as the default license', function() {
      var res = config.normalize({});
      assert(res.hasOwnProperty('license'));
      assert.equal(res.license, 'MIT');
    });

    it('should return license as is if it is a string', function() {
      var res = config.normalize({license: 'MIT'});
      assert(res.hasOwnProperty('license'));
      assert.equal(res.license, 'MIT');
    });

    it('should convert from an object to a string', function() {
      var res = config.normalize({license: {type: 'MIT'}});
      assert(res.hasOwnProperty('license'));
      assert.equal(res.license, 'MIT');
    });

    it('should convert from an array to a string', function() {
      var res = config.normalize({license: [{type: 'MIT'}]});
      assert(res.hasOwnProperty('license'));
      assert.equal(res.license, 'MIT');
    });
  });

  describe('people', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    describe('contributors', function() {
      it('should not add an empty contributors field', function() {
        var res = config.normalize({});
        assert(!res.hasOwnProperty('contributors'));
      });

      it('should convert contributor objects to strings', function() {
        var pkg = {
          contributors: [{
            name: 'Jon Schlinkert',
            url: 'https://github.com/jonschlinkert'
          }]
        };
        var res = config.normalize(pkg);
        assert(res.contributors);
        var expected = 'Jon Schlinkert (https://github.com/jonschlinkert)';
        assert.equal(res.contributors[0], expected);
      });
    });
  });

  describe('repository', function() {
    it('should use the given repository', function() {
      var pkg = {repository: 'jonschlinkert/foo'};
      var res = config.normalize(pkg);
      assert(res.repository);
      assert.equal(res.repository, 'jonschlinkert/foo');
    });

    it('should use the git remote url', function() {
      var pkg = {repository: ''};
      var res = config.normalize(pkg);
      assert(res.repository);
      assert.equal(res.repository, 'jonschlinkert/test-project');
    });

    it('should convert repository.url to a string', function() {
      var pkg = {repository: {url: 'https://github.com/jonschlinkert/foo.git'}};
      var res = config.normalize(pkg);
      assert(res.repository);
      assert.equal(res.repository, 'jonschlinkert/foo');
    });
  });

  describe('bugs', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should fix the bugs value based on repo information', function() {
      var pkg = {bugs: {url: 'jonschlinkert/foo'}};
      var res = config.normalize(pkg);
      assert(res.bugs);
      assert.equal(res.bugs.url, 'https://github.com/jonschlinkert/foo/issues');
    });

    it('should use the given bugs value', function() {
      var opts = {bugs: {url: 'jonschlinkert/foo'}};
      var res = config.normalize({}, opts);
      assert(res.bugs);
      assert.equal(res.bugs.url, 'https://github.com/jonschlinkert/foo/issues');
    });

    it('should use the value function passed on options', function() {
      var pkg = { bugs: '' };
      var res = config.normalize(pkg, {
        fields: {
          bugs: {
            type: ['string', 'object'],
            normalize: function custom() {
              return { url: 'abc' };
            }
          }
        }
      });
      assert(res.bugs);
      assert.equal(res.bugs.url, 'abc');
    });

    it('should use a custom type passed on options', function() {
      var pkg = {bugs: '', owner: 'foo'};
      var res = config.normalize(pkg, {
        extend: false,
        fields: {
          bugs: {
            type: ['object', 'string'],
            normalize: function custom(key, val, config, schema) {
              schema.update('repository', config);
              var bugs = {};
              bugs.url = config.homepage + '/bugs';
              return bugs;
            }
          }
        }
      });

      assert.equal(typeof res.bugs, 'object');
      assert(res.bugs.url);
      assert.equal(res.bugs.url, 'https://github.com/foo/test-project/bugs');
    });

    it('should use owner passed on options', function() {
      var pkg = {bugs: ''};
      var res = config.normalize(pkg, {
        owner: 'foo',
        extend: false,
        fields: {
          bugs: {
            type: ['object', 'string'],
            normalize: function custom(key, val, config, schema) {
              schema.update('repository', config);
              var bugs = {};
              bugs.url = config.homepage + '/bugs';
              return bugs;
            }
          }
        }
      });

      assert.equal(typeof res.bugs, 'object');
      assert(res.bugs.url);
      assert.equal(res.bugs.url, 'https://github.com/foo/test-project/bugs');
    });

    it('should convert bugs.url to a string when specified', function() {
      var pkg = {bugs: {url: 'https://github.com/jonschlinkert/foo.git'}};
      var res = config.normalize(pkg, {
        extend: false,
        fields: {
          bugs: {
            type: 'string',
            normalize: function(val, key, config) {
              return val.url;
            }
          }
        }
      });
      assert(res.bugs);
      assert.equal(res.bugs, 'https://github.com/jonschlinkert/foo.git');
    });
  });

  describe('license', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should convert a license object to a string', function() {
      var pkg = {
        license: {
          type: 'MIT',
          url: 'https://github.com/jonschlinkert/test-project/blob/master/LICENSE-MIT'
        }
      };

      var res = config.normalize(pkg);
      assert.equal(typeof res.license, 'string');
      assert.equal(res.license, 'MIT');
    });
  });

  describe('licenses', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should emit a deprecation warning when licenses is defined', function(cb) {
      var pkg = {licenses: {type: 'MIT'}};
      var count = 0;

      config.on('warning', function(method, key, err) {
        if (key === 'licenses') {
          count++;
        }
      });

      config.normalize(pkg);
      assert.equal(count, 1);
      cb();
    });

    it('should convert a licenses array to a license string', function() {
      var pkg = {
        licenses: [
          {type: 'MIT', url: 'https://github.com/jonschlinkert/test-project/blob/master/LICENSE-MIT'}
        ]
      };

      var res = config.normalize(pkg);
      assert(!res.licenses);
      assert(res.license);
      assert.equal(typeof res.license, 'string');
      assert.equal(res.license, 'MIT');
    });

    it('should convert from an object to a string', function() {
      var pkg = {
        licenses: {type: 'MIT', url: 'https://github.com/jonschlinkert/test-project/blob/master/LICENSE-MIT'}
      };

      var res = config.normalize(pkg);
      assert(!res.licenses);
      assert(res.license);
      assert.equal(typeof res.license, 'string');
      assert.equal(res.license, 'MIT');
    });
  });

  describe('dependencies', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should remove dependencies when empty when `omitEmpty` is true', function() {
      var pkg = {dependencies: {}};
      var res = config.normalize(pkg, {omitEmpty: true});
      assert(!res.dependencies);
    });
  });

  describe('devDependencies', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should remove empty devDependencies when omitEmpty is true', function() {
      var pkg = {devDependencies: {}};
      var res = config.normalize(pkg, {omitEmpty: true});
      assert(!res.devDependencies);
    });
  });

  describe('engineStrict', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should delete engineStrict and replace it with engine-strict', function() {
      var pkg = { engineStrict: true };
      var res = config.normalize(pkg);
      assert.equal(typeof res.engineStrict, 'undefined');
      assert.equal(res['engine-strict'], true);
    });

    it('should remove engineStrict from the object', function() {
      var pkg = { engineStrict: true };
      var res = config.normalize(pkg);
      assert(!res.hasOwnProperty('engineStrict'));
    });
  });

  describe('engine-strict', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should warn when engine-strict value is invalid', function(cb) {
      var pkg = { 'engine-strict': 'foo' };
      var count = 0;

      config.on('warning', function(method, key, err) {
        if (key === 'engine-strict') {
          count++;
        }
      });

      config.normalize(pkg);
      assert.equal(count, 1);
      cb();
    });
  });

  describe('scripts', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should clean up mocha scripts', function() {
      var pkg = {scripts: {test: 'mocha -R spec'} };

      var res = config.normalize(pkg);
      assert(res.scripts);
      assert.equal(typeof res.scripts, 'object');
      assert.equal(res.scripts.test, 'mocha');
    });

    it('should return scripts if it is an object', function() {
      var pkg = {scripts: {test: 'foo'} };

      var res = config.normalize(pkg);
      assert(res.scripts);
      assert.equal(typeof res.scripts, 'object');
      assert.equal(res.scripts.test, 'foo');
    });
  });

  describe('keywords', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should use the name to create keywords when the array is empty', function() {
      var pkg = { keywords: [] };
      var res = config.normalize(pkg);
      assert.equal(res.keywords[0], 'project');
      assert.equal(res.keywords[1], 'test');
      assert.equal(res.keywords.length, 2);
    });

    it('should sort keywords', function() {
      var pkg = { keywords: ['foo', 'bar', 'baz'] };
      var res = config.normalize(pkg);
      assert.equal(res.keywords[0], 'bar');
      assert.equal(res.keywords[1], 'baz');
      assert.equal(res.keywords[2], 'foo');
    });

    it('should remove duplicates', function() {
      var pkg = { keywords: ['foo', 'foo', 'foo', 'foo', 'bar', 'baz'] };
      var res = config.normalize(pkg);
      assert.equal(res.keywords.length, 3);
    });
  });

  describe('preferGlobal', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should warn when preferGlobal is defined and `bin` is not defined', function(cb) {
      var pkg = {preferGlobal: true};
      var count = 0;

      config.on('warning', function(method, key, err) {
        if (key === 'preferGlobal') {
          count++;
        }
      });

      var res = config.normalize(pkg);
      assert(res.preferGlobal);
      assert.equal(count, 1);
      cb();
    });

    it('should not warn when preferGlobal is defined and `bin` is defined', function(cb) {
      var pkg = {preferGlobal: true, bin: 'main.js'};
      var count = 0;

      config.on('warning', function(method, key, err) {
        if (key === 'preferGlobal') {
          count++;
        }
      });

      var res = config.normalize(pkg);
      assert(res.preferGlobal);
      assert.equal(count, 0);
      cb();
    });

    it('should return bin as-is when it is a string', function() {
      var pkg = {bin: 'main.js'};

      var res = config.normalize(pkg);
      assert(res.bin);
      assert.equal(res.bin, 'main.js');
    });

    it('should not add bin file to `files` when `options.bin` is false', function() {
      var pkg = {bin: 'main.js'};

      var res = config.normalize(pkg, {bin: false});
      assert(!res.files);
    });

    it('should add bin file to `files`', function() {
      var pkg = {bin: 'main.js'};

      var res = config.normalize(pkg);
      assert(res.files);
      assert.equal(res.files[0], 'main.js');
    });
  });

  describe('bin', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should not emit a warning when bin file string exists', function(cb) {
      var pkg = {bin: 'main.js'};
      var count = 0;

      config.on('warning', function(method, key, err) {
        if (key === 'bin') {
          count++;
        }
      });

      config.normalize(pkg);
      assert.equal(count, 0);
      cb();
    });

    it('should not emit a warning when bin file object exists', function(cb) {
      var pkg = {bin: {foo: 'main.js'}};
      var count = 0;

      config.on('warning', function(method, key, err) {
        if (key === 'bin') {
          count++;
        }
      });

      config.normalize(pkg);
      assert.equal(count, 0);
      cb();
    });
  });
});

