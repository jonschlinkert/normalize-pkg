'use strict';

var create = require('./');
var schema = create();

var pkg = schema.normalize({});

console.log(pkg)
