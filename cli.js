#!/usr/bin/env node

var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var create = require('./');
var schema = create();

var pkg = require(path.resolve(process.cwd(), 'package.json'));
var res = schema.normalize(pkg);

console.log(res);
