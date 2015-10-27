'use strict';

require('mocha');
var assert = require('assert');
var normalize = require('..');

describe('name', function () {
  it('should use the defined project name', function () {
    var pkg = {
      name: 'foo'
    };

    var res = normalize(pkg, {extend: false});
    assert(res.name);
    assert(res.name === 'foo');
  });

  it('should determine the correct project name to use', function () {
    var pkg = {
      name: ''
    };

    var res = normalize(pkg, {extend: false});
    assert(res.name);
    assert(res.name === 'normalize-pkg');
  });
});

describe('version', function () {
  it('should use the given version', function () {
    var pkg = {
      version: '1.0.0'
    };

    var res = normalize(pkg, {extend: false});
    assert(res.version);
    assert(res.version === '1.0.0');
  });

  it('should use the default version', function () {
    var pkg = {
      version: ''
    };

    var res = normalize(pkg, {extend: false});
    assert(res.version);
    assert(res.version === '0.1.0');
  });
});

describe('homepage', function () {
  it('should use the given homepage', function () {
    var pkg = {
      homepage: 'https://github.com/assemble/assemble'
    };

    var res = normalize(pkg, {extend: false});
    assert(res.homepage);
    assert(res.homepage === 'https://github.com/assemble/assemble');
  });

  it('should get homepage from repository.url', function () {
    var pkg = {
      homepage: '',
      repository: 'git://github.com/jonschlinkert/normalize-pkg.git'
    };

    var res = normalize(pkg, {extend: false});
    assert(res.homepage);
    assert(res.homepage === 'https://github.com/jonschlinkert/normalize-pkg');
  });
});

describe('author', function () {
  it('should use the given author as a string', function () {
    var pkg = {author: 'Jon Schlinkert'};

    var res = normalize(pkg, {extend: false});
    assert(res.author);
    assert(res.author === 'Jon Schlinkert');
  });

  it('should convert an author object to a string', function () {
    var pkg = {author: {name: 'Jon Schlinkert', url: 'https://github.com/jonschlinkert'}};

    var res = normalize(pkg, {extend: false});
    assert(res.author);
    assert(res.author === 'Jon Schlinkert (https://github.com/jonschlinkert)');
  });
});

describe('repository', function () {
  it('should use the given repository', function () {
    var pkg = {repository: 'jonschlinkert/foo'};

    var res = normalize(pkg, {extend: false});
    assert(res.repository);
    assert(res.repository === 'jonschlinkert/foo');
  });

  it('should use the git remote origin url', function () {
    var pkg = {repository: ''};
    var res = normalize(pkg, {extend: false});
    assert(res.repository);
    assert(res.repository === 'jonschlinkert/normalize-pkg');
  });

  it('should convert repository.url to a string', function () {
    var pkg = {repository: {url: 'https://github.com/jonschlinkert/foo.git'}};
    var res = normalize(pkg, {extend: false});
    assert(res.repository);
    assert(res.repository === 'jonschlinkert/foo');
  });
});

describe('license', function () {
  it('should convert a licenses array to a license string', function () {
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

describe('files', function () {
  it('should add main to files array if empty', function () {
    var pkg = {
      files: [],
      main: 'foo.js'
    };

    var res = normalize(pkg, {extend: false});
    assert(res.files.length);
    assert(res.files.indexOf('foo.js') !== -1);
  });
});

describe('dependencies', function () {
  it('should move common devDeps to devDependencies', function () {
    var pkg = {dependencies: {'mocha': '^0.2.2'}};
    var res = normalize(pkg, {extend: false});
    assert(!res.dependencies);
    assert(res.devDependencies);
    assert(res.devDependencies.mocha === '^0.2.2');
  });

  it('should remove dependencies when empty', function () {
    var pkg = {dependencies: {}};
    var res = normalize(pkg, {extend: false});
    assert(!res.dependencies);
  });
});

describe('devDependencies', function () {
  it('should clean up devDependencies', function () {
    var pkg = {
      devDependencies: {
        'verb-tag-jscomments': '^0.2.2'
      }
    };
    var res = normalize(pkg, {extend: false});
    assert(!res.devDependencies);
  });

  it('should remove devDependencies if empty', function () {
    var pkg = {devDependencies: {}};
    var res = normalize(pkg, {extend: false});
    assert(!res.devDependencies);
  });

  it('should remove old versions of verb', function () {
    var pkg = {devDependencies: {'verb': '^0.4.0'}};
    var res = normalize(pkg, {extend: false});
    assert(!res.devDependencies);
  });
});

describe('scripts', function () {
  it('should clean up mocha scripts', function () {
    var pkg = {scripts: {test: 'mocha -R spec'} };

    var res = normalize(pkg, {extend: false});
    assert(res.scripts);
    assert(typeof res.scripts === 'object');
    assert(res.scripts.test === 'mocha');
  });
});

describe('preferGlobal', function () {
  it('should set preferGlobal when `bin` exists', function () {
    var pkg = {preferGlobal: false};

    var res = normalize(pkg, {extend: false});
    assert(res.preferGlobal === true);
  });
});

describe('bin', function () {
  it('should throw when bin points to a non-existant filepath', function (cb) {
    var pkg = {bin: {foo: 'bin/foo.js'}};

    try {
      normalize(pkg, {extend: false});
      cb(new Error('expected an error'));
    } catch(err) {
      assert(err);
      assert(err.message);
      assert(err.message === 'package.json bin > bin/foo.js does not exist');
      cb();
    }
  });
});
