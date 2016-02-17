'use strict';

require('mocha');
var assert = require('assert');
var create = require('..');
var schema;

describe('normalize', function() {
  beforeEach(function() {
    schema = create();
  });

  describe('defaults', function() {
    it('should add default properties properties', function() {
      var res = schema.normalize({});
      assert(res);
    });
  });

  describe('name', function() {
    it('should use the defined project name', function() {
      var pkg = { name: 'foo' };
      var res = schema.normalize(pkg);
      assert(res.name);
      assert.equal(res.name, 'foo');
    });

    it('should get the project name when string is empty', function() {
      var pkg = { name: '' };
      var res = schema.normalize(pkg);
      assert(res.name);
      assert.equal(res.name, 'normalize-pkg');
    });

    it('should get the project name when missing', function() {
      var pkg = {};
      var res = schema.normalize(pkg);
      assert(res.name);
      assert.equal(res.name, 'normalize-pkg');
    });

    it('should use the normalize function defined on options', function() {
      var pkg = { name: 'foo' };
      var opts = {
        extend: true,
        fields: {
          name: {
            normalize: function custom() {
              return 'bar'
            }
          }
        }
      };

      var res = schema.normalize(pkg, opts);
      assert(res.name);
      assert.equal(res.name, 'bar');
    });
  });

  describe('version', function() {
    it('should use the given version', function() {
      var pkg = {version: '1.0.0'};
      var res = schema.normalize(pkg);
      assert(res.version);
      assert.equal(res.version, '1.0.0');
    });

    it('should use the default version', function() {
      var pkg = {version: ''};
      var res = schema.normalize(pkg);
      assert(res.version);
      assert.equal(res.version, '0.1.0');
    });
  });

  describe('homepage', function() {
    it('should add a homepage from git repository', function() {
      var res = schema.normalize({});
      assert(res.homepage);
      assert.equal(res.homepage, 'https://github.com/jonschlinkert/normalize-pkg');
    });

    it('should add repository when setting hompage', function() {
      var res = schema.normalize({});
      assert(res.homepage);
      assert.equal(res.repository, 'jonschlinkert/normalize-pkg');
    });

    it('should set `remote` on schema.data', function() {
      var res = schema.normalize({});
      assert.equal(schema.data.remote, 'https://github.com/jonschlinkert/normalize-pkg.git');
    });

    it('should use the given homepage', function() {
      var pkg = {homepage: 'https://github.com/assemble/assemble'};
      var res = schema.normalize(pkg);
      assert(res.homepage);
      assert.equal(res.homepage, 'https://github.com/assemble/assemble');
    });

    it('should get homepage from repository.url', function() {
      var pkg = {
        homepage: '',
        repository: 'git://github.com/jonschlinkert/normalize-pkg.git'
      };

      var res = schema.normalize(pkg);
      assert(res.homepage);
      assert.equal(res.homepage, 'https://github.com/jonschlinkert/normalize-pkg');
    });
  });

  describe('author', function() {
    it('should not add an empty author field', function() {
      var res = schema.normalize({});
      assert(!res.hasOwnProperty('author'));
    });

    it('should not add an empty authors field', function() {
      var res = schema.normalize({});
      assert(!res.hasOwnProperty('authors'));
    });

    it('should use the given author as a string', function() {
      var pkg = { author: 'Jon Schlinkert' };
      var res = schema.normalize(pkg);
      assert(res.author);
      assert.equal(res.author, 'Jon Schlinkert');
    });

    it('should convert an author object to a string', function () {
      var pkg = {
        author: {
          name: 'Jon Schlinkert',
          url: 'https://github.com/jonschlinkert'
        }
      };

      var res = schema.normalize(pkg);
      assert(res.author);
      assert.equal(res.author, 'Jon Schlinkert (https://github.com/jonschlinkert)');
    });
  });

  describe('maintainers', function() {
    it('should not add an empty maintainers field', function() {
      var res = schema.normalize({});
      assert(!res.hasOwnProperty('maintainers'));
    });
  });


  describe('license', function() {
    it('should add MIT as the default license', function() {
      var res = schema.normalize({});
      assert(res.hasOwnProperty('license'));
      assert.equal(res.license, 'MIT');
    });

    it('should return license as is if it is a string', function() {
      var res = schema.normalize({license: 'MIT'});
      assert(res.hasOwnProperty('license'));
      assert.equal(res.license, 'MIT');
    });

    it('should convert from an object to a string', function() {
      var res = schema.normalize({license: {type: 'MIT'}});
      assert(res.hasOwnProperty('license'));
      assert.equal(res.license, 'MIT');
    });

    it('should convert from an array to a string', function() {
      var res = schema.normalize({license: [{type: 'MIT'}]});
      assert(res.hasOwnProperty('license'));
      assert.equal(res.license, 'MIT');
    });
  });

  describe('people', function() {
    beforeEach(function() {
      schema = create();
    });

    describe('contributors', function() {
      it('should not add an empty contributors field', function() {
        var res = schema.normalize({});
        assert(!res.hasOwnProperty('contributors'));
      });

      it('should convert contributor objects to strings', function () {
        var pkg = {
          contributors: [{
            name: 'Jon Schlinkert',
            url: 'https://github.com/jonschlinkert'
          }]
        };
        var res = schema.normalize(pkg);
        assert(res.contributors);
        var expected = 'Jon Schlinkert (https://github.com/jonschlinkert)';
        assert.equal(res.contributors[0], expected);
      });
    });
  });

  describe('repository', function() {
    it('should use the given repository', function() {
      var pkg = {repository: 'jonschlinkert/foo'};
      var res = schema.normalize(pkg);
      assert(res.repository);
      assert.equal(res.repository, 'jonschlinkert/foo');
    });

    it('should use the git remote origin url', function() {
      var pkg = {repository: ''};
      var res = schema.normalize(pkg);
      assert(res.repository);
      assert.equal(res.repository, 'jonschlinkert/normalize-pkg');
    });

    it('should convert repository.url to a string', function() {
      var pkg = {repository: {url: 'https://github.com/jonschlinkert/foo.git'}};
      var res = schema.normalize(pkg);
      assert(res.repository);
      assert.equal(res.repository, 'jonschlinkert/foo');
    });
  });

  describe('bugs', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should use the given bugs value', function() {
      var pkg = {bugs: {url: 'jonschlinkert/foo'}};

      var res = schema.normalize(pkg);
      assert(res.bugs);
      assert.equal(res.bugs.url, 'jonschlinkert/foo');
    });

    it('should use the value function passed on options', function() {
      var pkg = { bugs: '' };
      var res = schema.normalize(pkg, {
        fields: {
          bugs: {
            type: ['string', 'object'],
            normalize: function custom() {
              return { url: 'abc' }
            }
          }
        }
      });
      assert(res.bugs);
      assert.equal(res.bugs.url, 'abc');
    });

    it('should use a custom type passed on options', function() {
      var pkg = {bugs: '', repository: 'https://github.com/foo'};
      var res = schema.normalize(pkg, {
        extend: false,
        fields: {
          bugs: {
            type: ['object', 'string'],
            normalize: function custom(key, val, config) {
              var bugs = {};
              bugs.url = config.repository + '/bugs'
              return bugs;
            }
          }
        }
      });

      assert.equal(typeof res.bugs, 'object');
      assert(res.bugs.url);
      assert.equal(res.bugs.url, 'https://github.com/foo/bugs');
    });

    it('should convert bugs.url to a string when specified', function() {
      var pkg = {bugs: {url: 'https://github.com/jonschlinkert/foo.git'}};
      var res = schema.normalize(pkg, {
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
      schema = create();
    });

    it('should convert a license object to a string', function() {
      var pkg = {
        license: {
          type: 'MIT', 
          url: 'https://github.com/jonschlinkert/normalize-pkg/blob/master/LICENSE-MIT'
        }
      };

      var res = schema.normalize(pkg);
      assert.equal(typeof res.license, 'string');
      assert.equal(res.license, 'MIT');
    });
  });

  describe('licenses', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should convert a licenses array to a license string', function() {
      var pkg = {
        licenses: [
          {type: 'MIT', url: 'https://github.com/jonschlinkert/normalize-pkg/blob/master/LICENSE-MIT'}
        ]
      };

      var res = schema.normalize(pkg);
      assert(!res.licenses);
      assert(res.license);
      assert.equal(typeof res.license, 'string');
      assert.equal(res.license, 'MIT');
    });

    it('should convert from an object to a string', function() {
      var pkg = {
        licenses: {type: 'MIT', url: 'https://github.com/jonschlinkert/normalize-pkg/blob/master/LICENSE-MIT'}
      };

      var res = schema.normalize(pkg);
      assert(!res.licenses);
      assert(res.license);
      assert.equal(typeof res.license, 'string');
      assert.equal(res.license, 'MIT');
    });
  });

  describe('files', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should add main file to files array if empty', function() {
      var pkg = {
        files: [],
        main: 'index.js'
      };

      var res = schema.normalize(pkg);
      assert(res.files.length);
      assert(res.files.indexOf('index.js') !== -1);
    });

    it('should create files array with main if undefined', function() {
      var pkg = {
        main: 'index.js'
      };

      var res = schema.normalize(pkg);
      assert(res.files.length);
      assert(res.files.indexOf('index.js') !== -1);
    });

    it('should not double add the file to files', function() {
      var pkg = {
        files: ['index.js'],
        main: 'index.js'
      };

      var res = schema.normalize(pkg);
      assert.equal(res.files.length, 1);
      assert(res.files.indexOf('index.js') !== -1);
    });

    it('should remove main if the file does not exist', function() {
      var pkg = {
        main: 'foo.js'
      };

      var res = schema.normalize(pkg);
      assert(!res.main);
    });

    it('should do nothing if not defined', function() {
      var pkg = {};

      var res = schema.normalize(pkg);
      assert.equal(typeof res.main, 'undefined');
    });
  });

  describe('dependencies', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should remove dependencies when empty when `omitEmpty` is true', function() {
      var pkg = {dependencies: {}};
      var res = schema.normalize(pkg, {omitEmpty: true});
      assert(!res.dependencies);
    });
  });

  describe('devDependencies', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should remove empty devDependencies when omitEmpty is true', function() {
      var pkg = {devDependencies: {}};
      var res = schema.normalize(pkg, {omitEmpty: true});
      assert(!res.devDependencies);
    });
  });

  describe('engineStrict', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should delete engineStrict and replace it with engine-strict', function() {
      var pkg = {engineStrict: true};

      var res = schema.normalize(pkg);
      assert.equal(typeof res.engineStrict, 'undefined');
      assert.equal(res['engine-strict'], true);
    });
  });

  describe('scripts', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should clean up mocha scripts', function() {
      var pkg = {scripts: {test: 'mocha -R spec'} };

      var res = schema.normalize(pkg);
      assert(res.scripts);
      assert.equal(typeof res.scripts, 'object');
      assert.equal(res.scripts.test, 'mocha');
    });

    it('should return scripts if it is an object', function() {
      var pkg = {scripts: {test: 'foo'} };

      var res = schema.normalize(pkg);
      assert(res.scripts);
      assert.equal(typeof res.scripts, 'object');
      assert.equal(res.scripts.test, 'foo');
    });
  });

  describe('keywords', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should use the name to create keywords when the array is empty', function() {
      var pkg = {keywords: []};
      var res = schema.normalize(pkg);
      assert.equal(res.keywords[0], 'normalize');
      assert.equal(res.keywords[1], 'pkg');
      assert.equal(res.keywords.length, 2);
    });

    it('should sort keywords', function() {
      var pkg = { keywords: ['foo', 'bar', 'baz'] };
      var res = schema.normalize(pkg);
      assert.equal(res.keywords[0], 'bar');
      assert.equal(res.keywords[1], 'baz');
      assert.equal(res.keywords[2], 'foo');
    });

    it('should remove duplicates', function() {
      var pkg = { keywords: ['foo', 'foo', 'foo', 'foo', 'bar', 'baz'] };
      var res = schema.normalize(pkg);
      assert.equal(res.keywords.length, 3);
    });
  });

  describe('preferGlobal', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should warn when preferGlobal is defined and `bin` does not exist', function(cb) {
      var pkg = {preferGlobal: true};
      var count = 0;

      schema.on('error', function(method, key, err) {
        if (method === 'validate' && key === 'preferGlobal') {
          count++;
        }
      });

      var res = schema.normalize(pkg);
      assert(res.preferGlobal);
      assert.equal(count, 1);
      cb();
    });

    it('should return bin as-is when it is a string', function() {
      var pkg = {name: 'foo', bin: 'index.js'};

      var res = schema.normalize(pkg);
      assert(res.bin);
      assert.equal(res.bin, 'index.js');
    });
  });

  describe('bin', function() {
    beforeEach(function() {
      schema = create();
    });

    it('should emit an error when bin points to an invalid filepath', function(cb) {
      var pkg = {bin: {foo: 'bin/foo.js'}};
      var count = 0;
      schema.on('error', function(method, key, err) {
        if (method === 'validate' && key === 'bin') {
          if (err.message === 'file \'bin/foo.js\' does not exist') {
            count++;
          }
        }
      });

      schema.normalize(pkg); 
      assert.equal(count, 1);
      cb();
    });
  });
});

