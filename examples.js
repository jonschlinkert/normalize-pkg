var parse = require('parse-git-config');
var remote = require('remote-origin-url');

var url = remote.sync();
console.log(parse.sync())
console.log(url)