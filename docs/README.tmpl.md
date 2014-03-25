# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %})

> {%= description %}

<!-- toc -->

## Quickstart
{%= docs("install") %}

## Usage

Run `normalize` in the command line to normalize the following properties in `package.json`:

* [license](#license)
* [bugs](#bugs)
* [author](#author)
* [repository](#repository)

### args

If you want to specify the source `package.json` to normalize, or the destination to write to, you can use this format:

```bash
normalize [src] [dest]
```

Or explicit:

* `-s` | `--src`: normalize the specified source file
* `-d` | `--dest`: write the file to the

## Normalized values

Currently, only the following values are normalized. If any of the values is missing, a polite warning will be logged, but nothing will be modified.

{%= docs("properties") %}

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)


## License
Copyright (c) 2014 [Jon Schlinkert](http://twitter.com/jonschlinkert)
Released under the [MIT license](./LICENSE-MIT)

***

{%= include("footer") %}
