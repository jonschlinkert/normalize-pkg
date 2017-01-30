# normalize-pkg [![NPM version](https://img.shields.io/npm/v/normalize-pkg.svg?style=flat)](https://www.npmjs.com/package/normalize-pkg) [![NPM monthly downloads](https://img.shields.io/npm/dm/normalize-pkg.svg?style=flat)](https://npmjs.org/package/normalize-pkg)  [![NPM total downloads](https://img.shields.io/npm/dt/normalize-pkg.svg?style=flat)](https://npmjs.org/package/normalize-pkg) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/normalize-pkg.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/normalize-pkg)

> Normalize values in package.json using the map-schema library.

<details>
<summary><strong>Table of Contents</strong></summary>
- [Install](#install)
- [Install](#install-1)
- [Usage](#usage)
- [Features](#features)
- [Schema](#schema)
- [Defaults](#defaults)
- [API](#api)
- [Options](#options)
  * [options.knownOnly](#optionsknownonly)
  * [options.pick](#optionspick)
  * [options.omit](#optionsomit)
  * [options.fields](#optionsfields)
  * [options.extend](#optionsextend)
- [About](#about)
</details>

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save normalize-pkg
```

## Install

Install with [bower](https://bower.io/)

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

## Schema

Values are normalized using a [schema](lib/schema.js) that is passed to [map-schema](https://github.com/jonschlinkert/map-schema).

* only properties that have a corresponding field on the schema will be normalized.
* any properties that do not have a corresponding field are returned unmodified.

See the [.field docs](#field) to learn how to add or overwrite a field on the schema.

## Defaults

A `default` value may optionally be defined when a `.field` is registered. When `.normalize` is run and a property that is required or recommended by npm is missing, `normalize-pkg` attempts to create the field if valid data can be found in the repository.

built-in fields have a default value:

* `version`: `'0.1.0'`
* `license`: `'MIT'`
* `engines`: `{node: '>= 0.10.0'}`

For example:

* `name`: the [project-name](https://github.com/jonschlinkert/project-name) library is used to fill in the name
* `bin`: if empty, populated with `cli.js` or `bin` if either exists on the file system

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
  engines: { node: '>= 0.10.0' } }
```

## API

### [NormalizePkg](index.js#L26)

Create an instance of `NormalizePkg` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var config = new NormalizePkg();
var pkg = config.normalize({
  author: {
    name: 'Jon Schlinkert',
    url: 'https://github.com/jonschlinkert'
  }
});
console.log(pkg);
//=> {author: 'Jon Schlinkert (https://github.com/jonschlinkert)'}
```

### [.field](index.js#L76)

Add a field to the schema, or overwrite or extend an existing field. The last argument is an `options` object that supports the following properties:

* `normalize` **{Function}**: function to be called on the value when the `.normalize` method is called
* `default` **{any}**: default value to be used when the package.json property is undefined.
* `required` **{Boolean}**: define `true` if the property is required

**Params**

* `name` **{String}**: Field name (required)
* `type` **{String|Array}**: One or more native javascript types allowed for the property value (required)
* `options` **{Object}**
* `returns` **{Object}**: Returns the instance

**Example**

```js
var config = new NormalizePkg();

config.field('foo', 'string', {
  default: 'bar'
});

var pkg = config.normalize({});
console.log(pkg);
//=> {foo:  'bar'}
```

### [.normalize](index.js#L102)

Iterate over `pkg` properties and normalize values that have corresponding [fields](#field) registered on the schema.

**Params**

* `pkg` **{Object}**: The `package.json` object to normalize
* `options` **{Object}**
* `returns` **{Object}**: Returns a normalized package.json object.

**Example**

```js
var config = new NormalizePkg();
var pkg = config.normalize(require('./package.json'));
```

## Options

### options.knownOnly

**Type**: `boolean`

**Default**: `undefined`

Omit properties from package.json that do not have a field registered on the schema.

```js
var Config = require('normalize-pkg');
var config = new Config({knownOnly: true});

var pkg = config.normalize({name: 'my-project', foo: 'bar'});
console.log(pkg);
//=> {name: 'my-project'}
```

### options.pick

**Type**: `array`

**Default**: `undefined`

Filter the resulting object to contain only the specified keys.

### options.omit

**Type**: `array`

**Default**: `undefined`

Remove the specified keys from the resulting object.

### options.fields

Pass a `fields` object on the options to customize any fields on the schema (also see [options.extend](#options-extend)):

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

### options.extend

**Type**: `boolean`

**Default**: `undefined`

Used with [options.field](#options-field), pass `true` if you want to extend a field that is already defined on the schema.

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

## About

### Related projects

[update](https://www.npmjs.com/package/update): Be scalable! Update is a new, open source developer framework and CLI for automating updates… [more](https://github.com/update/update) | [homepage](https://github.com/update/update "Be scalable! Update is a new, open source developer framework and CLI for automating updates of any kind in code projects.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Contributors

| **Commits** | **Contributor** | 
| --- | --- |
| 143 | [jonschlinkert](https://github.com/jonschlinkert) |
| 16 | [doowb](https://github.com/doowb) |
| 2 | [pdehaan](https://github.com/pdehaan) |

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
MIT

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.2, on January 30, 2017._