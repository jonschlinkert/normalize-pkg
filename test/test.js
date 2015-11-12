'use strict';

require('mocha');
var assert = require('assert');
var normalize = require('..');

describe('empty', function() {
  it('should not blow up with no properties', function() {
    var res = normalize({});
    assert(res);
  });

  it('should add a homepage from repository', function() {
    var res = normalize({});
    assert(res.homepage);
    assert(res.homepage === 'https://github.com/jonschlinkert/normalize-pkg');
  });

  it('should not add an empty author field', function() {
    var res = normalize({});
    assert(!res.hasOwnProperty('author'));
  });

  it('should not add an empty authors field', function() {
    var res = normalize({});
    assert(!res.hasOwnProperty('authors'));
  });

  it('should not add an empty maintainers field', function() {
    var res = normalize({});
    assert(!res.hasOwnProperty('maintainers'));
  });

  it('should not add an empty contributors field', function() {
    var res = normalize({});
    assert(!res.hasOwnProperty('contributors'));
  });

  it('should add MIT as the default license', function() {
    var res = normalize({});
    assert(res.hasOwnProperty('license'));
    assert(res.license === 'MIT');
  });
});

describe('name', function() {
  it('should use the defined project name', function() {
    var pkg = {name: 'foo'};

    var res = normalize(pkg, {extend: false});
    assert(res.name);
    assert(res.name === 'foo');
  });

  it('should use the value function defined on options', function() {
    var pkg = {name: 'foo'};
    var opts = {
      extend: false,
      name: {
        value: function custom() {
          return 'bar'
        }
      }
    };

    var res = normalize(pkg, opts);
    assert(res.name);
    assert(res.name === 'bar');
  });

  it('should determine the correct project name to use', function() {
    var pkg = {
      name: ''
    };

    var res = normalize(pkg, {extend: false});
    assert(res.name);
    assert(res.name === 'normalize-pkg');
  });
});

describe('version', function() {
  it('should use the given version', function() {
    var pkg = {
      version: '1.0.0'
    };

    var res = normalize(pkg, {extend: false});
    assert(res.version);
    assert(res.version === '1.0.0');
  });

  it('should use the default version', function() {
    var pkg = {
      version: ''
    };

    var res = normalize(pkg, {extend: false});
    assert(res.version);
    assert(res.version === '0.1.0');
  });
});

describe('homepage', function() {
  it('should use the given homepage', function() {
    var pkg = {
      homepage: 'https://github.com/assemble/assemble'
    };

    var res = normalize(pkg, {extend: false});
    assert(res.homepage);
    assert(res.homepage === 'https://github.com/assemble/assemble');
  });

  it('should get homepage from repository.url', function() {
    var pkg = {
      homepage: '',
      repository: 'git://github.com/jonschlinkert/normalize-pkg.git'
    };

    var res = normalize(pkg, {extend: false});
    assert(res.homepage);
    assert(res.homepage === 'https://github.com/jonschlinkert/normalize-pkg');
  });
});

describe('author', function() {
  it('should use the given author as a string', function() {
    var pkg = {author: 'Jon Schlinkert'};

    var res = normalize(pkg, {extend: false});
    assert(res.author);
    assert(res.author === 'Jon Schlinkert');
  });

  it('should convert an author object to a string', function() {
    var pkg = {author: {name: 'Jon Schlinkert', url: 'https://github.com/jonschlinkert'}};

    var res = normalize(pkg, {extend: false});
    assert(res.author);
    assert(res.author === 'Jon Schlinkert (https://github.com/jonschlinkert)');
  });
});

describe('contributors', function() {
  it('should convert contributor objects to strings', function() {
    var pkg = {contributors: [{name: 'Jon Schlinkert', url: 'https://github.com/jonschlinkert'}]};

    var res = normalize(pkg, {extend: false});
    assert(res.contributors);
    assert(res.contributors[0] === 'Jon Schlinkert (https://github.com/jonschlinkert)');
  });
});

describe('repository', function() {
  it('should use the given repository', function() {
    var pkg = {repository: 'jonschlinkert/foo'};

    var res = normalize(pkg, {extend: false});
    assert(res.repository);
    assert(res.repository === 'jonschlinkert/foo');
  });

  it('should use the git remote origin url', function() {
    var pkg = {repository: ''};
    var res = normalize(pkg, {extend: false});
    assert(res.repository);
    assert(res.repository === 'jonschlinkert/normalize-pkg');
  });

  it('should convert repository.url to a string', function() {
    var pkg = {repository: {url: 'https://github.com/jonschlinkert/foo.git'}};
    var res = normalize(pkg, {extend: false});
    assert(res.repository);
    assert(res.repository === 'jonschlinkert/foo');
  });
});

describe('bugs', function() {
  it('should use the given bugs value', function() {
    var pkg = {bugs: {url: 'jonschlinkert/foo'}};

    var res = normalize(pkg, {extend: false});
    assert(res.bugs);
    assert.equal(res.bugs.url, 'jonschlinkert/foo');
  });

  it('should use the value function passed on options', function() {
    var pkg = {bugs: ''};
    var res = normalize(pkg, {
      extend: false,
      bugs: {
        value: function custom() {
          return {url: 'abc'}
        }
      }
    });

    assert(res.bugs);
    assert.equal(res.bugs.url, 'abc');
  });

  it('should use a custom type passed on options', function() {
    var pkg = {bugs: '', repository: 'https://github.com/foo'};
    var res = normalize(pkg, {
      extend: false,
      bugs: {
        type: 'object',
        value: function custom(key, val, config) {
          var bugs = {};
          bugs.url = config.repository + '/bugs'
          return bugs;
        }
      }
    });

    assert.equal(typeof res.bugs, 'object');
    assert(res.bugs.url);
    assert.equal(res.bugs.url, 'https://github.com/foo/bugs');
  });

  it('should convert bugs.url to a string when specified', function() {
    var pkg = {bugs: {url: 'https://github.com/jonschlinkert/foo.git'}};
    var res = normalize(pkg, {
      extend: false,
      bugs: {
        type: 'string',
        value: function (key, val) {
          return val.url;
        }
      }
    });
    assert(res.bugs);
    assert.equal(res.bugs, 'https://github.com/jonschlinkert/foo.git');
  });
});

describe('license', function() {
  it('should convert a license object to a string', function() {
    var pkg = {
      license: {type: 'MIT', url: 'https://github.com/jonschlinkert/normalize-pkg/blob/master/LICENSE-MIT'}
    };

    var res = normalize(pkg, {extend: false});
    assert(typeof res.license === 'string');
    assert(res.license === 'MIT');
  });
});

describe('licenses', function() {
  it('should convert a licenses array to a license string', function() {
    var pkg = {
      licenses: [
        {type: 'MIT', url: 'https://github.com/jonschlinkert/normalize-pkg/blob/master/LICENSE-MIT'}
      ]
    };

    var res = normalize(pkg, {extend: false});
    assert(!res.licenses);
    assert(res.license);
    assert(typeof res.license === 'string');
    assert(res.license === 'MIT');
  });
});

describe('files', function() {
  it('should add index.js to files array if empty', function() {
    var pkg = {
      files: [],
      main: 'index.js'
    };

    var res = normalize(pkg, {extend: false});
    assert(res.files.length);
    assert(res.files.indexOf('index.js') !== -1);
  });

  it('should remove main if it does not exist', function() {
    var pkg = {
      main: 'foo.js'
    };

    var res = normalize(pkg, {extend: false});
    assert(!res.main);
  });
});

describe('dependencies', function() {
  it('should move common devDeps to devDependencies', function() {
    var pkg = {dependencies: {'mocha': '^0.2.2', should: '*', chai: '*'}};
    var res = normalize(pkg, {extend: false});
    assert(!res.dependencies);
    assert(res.devDependencies);
    assert(res.devDependencies.mocha === '*');
  });

  it('should remove dependencies when empty', function() {
    var pkg = {dependencies: {}};
    var res = normalize(pkg, {extend: false});
    assert(!res.dependencies);
  });
});

describe('devDependencies', function() {
  it('should clean up devDependencies', function() {
    var pkg = {
      devDependencies: {
        'verb-tag-jscomments': '^0.2.2'
      }
    };
    var res = normalize(pkg, {extend: false});
    assert(!res.devDependencies);
  });

  it('should remove devDependencies if empty', function() {
    var pkg = {devDependencies: {}};
    var res = normalize(pkg, {extend: false});
    assert(!res.devDependencies);
  });
});

describe('scripts', function() {
  it('should clean up mocha scripts', function() {
    var pkg = {scripts: {test: 'mocha -R spec'} };

    var res = normalize(pkg, {extend: false});
    assert(res.scripts);
    assert(typeof res.scripts === 'object');
    assert(res.scripts.test === 'mocha');
  });
});

describe('keywords', function() {
  it('should remove keywords is empty', function() {
    var pkg = {keywords: []};
    var res = normalize(pkg, {extend: false});
    assert(!res.keywords);
  });

  it('should sort keywords', function() {
    var pkg = { keywords: ['foo', 'bar', 'baz'] };
    var res = normalize(pkg, {extend: false});
    assert(res.keywords[0] === 'bar');
    assert(res.keywords[1] === 'baz');
    assert(res.keywords[2] === 'foo');
  });

  it('should remove duplicates', function() {
    var pkg = { keywords: ['foo', 'foo', 'foo', 'foo', 'bar', 'baz'] };
    var res = normalize(pkg, {extend: false});
    assert.equal(res.keywords.length, 3);
  });
});

describe('preferGlobal', function() {
  it('should remove preferGlobal when `bin` does not exist', function() {
    var pkg = {preferGlobal: true};

    var res = normalize(pkg, {extend: false});
    assert(!res.preferGlobal);
  });
});

describe('bin', function() {
  it('should throw when bin points to an invalid filepath', function(cb) {
    var pkg = {bin: {foo: 'bin/foo.js'}};

    try {
      normalize(pkg, {extend: false});
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert(err.message);
      assert(err.message === 'package.json bin > bin/foo.js does not exist');
      cb();
    }
  });
});

