# normalize-pkg [![NPM version](https://img.shields.io/npm/v/normalize-pkg.svg?style=flat)](https://www.npmjs.com/package/normalize-pkg) [![NPM downloads](https://img.shields.io/npm/dm/normalize-pkg.svg?style=flat)](https://npmjs.org/package/normalize-pkg) [![Build Status](https://img.shields.io/travis/jonschlinkert/normalize-pkg.svg?style=flat)](https://travis-ci.org/jonschlinkert/normalize-pkg)

> Normalize values in package.json.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install normalize-pkg --save
```

Install with [bower](http://bower.io/)

```sh
$ bower install normalize-pkg --save
```

## Usage

```js
var config = require('./')();
var pkg = config.normalize(require('./package'));
```

## Features

Normalizes most package.json fields, and:

* converts `repository` objects to a string
* stringifies `author` object
* stringifies each "person" object in `maintainers`, `contributors` and `collaborators`
* converts `licenses` arrays and objects to a `license` string
* removes files that don't exist from `bin`, `main` and the `files` array
* adds `cli.js` to `bin` if it exists
* creates `keywords` array from `name` if not defined

See the [schema](lib/schema.js), [normalizers](lib/normalizers), and [unit tests](test) for more examples.

## Normalizing fields

Fields are normalized using a schema (powered by [map-schema](https://github.com/jonschlinkert/map-schema)).

**Defaults**

Defaults are based on npm recommendations. When a required or recommended field is missing, `normalize-pkg` attempts to create the field if valid data can be found in the repository.

**Example**

The following:

```js
var config = require('./')();

// no package.json is passed, just an empty object
var pkg = config.normalize({});
console.log(pkg);
```

**Results**

Since an empty object was passed, `normalize-pkg` was smart enough to fill in missing fields looking for info in the project. In this case, specifically from parsing `.git` config and using any defaults defined on the schema.

```js
{ name: 'normalize-pkg',
  version: '0.1.0',
  homepage: 'https://github.com/jonschlinkert/normalize-pkg',
  repository: 'jonschlinkert/normalize-pkg',
  license: 'MIT',
  files: [ 'index.js' ],
  main: 'index.js',
  engines: { node: '>= 0.10.0' },
  keywords: [ 'normalize', 'pkg' ] }
```

## Options

### options.pick

**Type**: `array`

**Default**: `undefined`

Filter the resulting object to contain only the specified keys.

### options.omit

**Type**: `array`

**Default**: `undefined`

Remove the specified keys from the resulting object.

## Customize

Pass a `fields` object on the options to customize any fields on the schema (also define `extend: true` if you want the field to extend a field that is already defined):

```js
var pkg = config.normalize(require('./package'), {
  extend: true,
  fields: {
    name: {
      normalize: function() {
        return 'bar'
      }
    }
  }
});

console.log(pkg.name);
//=> 'bar'
```

## Related projects

You might also be interested in these projects:

[update](https://www.npmjs.com/package/update): Easily keep anything in your project up-to-date by installing the updaters you want to use… [more](https://www.npmjs.com/package/update) | [homepage](https://github.com/update/update)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/normalize-pkg/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/normalize-pkg/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v, on March 27, 2016._