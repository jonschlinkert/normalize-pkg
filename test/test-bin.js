'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var del = require('delete');
var createRepo = require('./support/git');
var Normalizer = require('..');
var config;

var origCwd = process.cwd();
var project = path.resolve(__dirname, 'fixtures/project-bin');
var remote = `https://github.com/jonschlinkert/${path.basename(project)}.git`;
var gitPath = path.resolve(project, '.git');

describe('normalize (bin)', function() {
  beforeEach(function() {
    config = new Normalizer({verbose: false});
  });

  before(function(cb) {
    process.chdir(project);
    createRepo(project, remote, cb);
  });

  after(function(cb) {
    process.chdir(origCwd);
    del(gitPath, cb);
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

      assert.equal(res.files.indexOf('bin'), 0);
      assert.equal(res.files.indexOf('cli.js'), 1);
      assert.equal(res.files.indexOf('main.js'), 2);
    });

    it('should not add `main` file to files array when file does not exist', function() {
      var pkg = {
        files: [],
        main: 'index.js'
      };

      var res = config.normalize(pkg);
      assert(res.hasOwnProperty('files'));
      assert(res.files.indexOf('index.js') === -1);
    });

    it('should create files array with main', function() {
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
      assert.equal(res.files.length, 3);
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

  describe('preferGlobal', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
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
  });

  describe('bin', function() {
    beforeEach(function() {
      config = new Normalizer({verbose: false});
    });

    it('should add `bin/foo.js` to bin', function() {
      var res = config.normalize({});
      assert.equal(res.bin[res.name], 'bin/foo.js');
    });

    it('should add `cli.js` to bin', function(cb) {
      del('bin/foo.js', function(err) {
        if (err) return cb(err);
        var res = config.normalize({});
        assert.equal(res.bin[res.name], 'cli.js');
        fs.writeFile('bin/foo.js', '#!/usr/bin/env node\n\n', cb);
      });
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

