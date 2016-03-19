'use strict';

require('mocha');
var assert = require('assert');
var utils = require('../lib/utils');

describe('utils', function() {
  describe('.arrayify', function() {
    it('should cast a value to an array', function() {
      assert.deepEqual(utils.arrayify(['foo']), ['foo']);
      assert.deepEqual(utils.arrayify('foo'), ['foo']);
      assert.deepEqual(utils.arrayify(), []);
    });
  });
});

