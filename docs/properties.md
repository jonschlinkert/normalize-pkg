## license

If `license` is formatted as a string:

```json
{
  "license": "MIT"
}
```

It will be normalized to:

```json
{
  "type": "MIT",
  "url": "http://opensource.org/licenses/MIT"
}
```

`license.url` is determined based on a `search()` of the string, with basic support for the following:

* `MIT`
* `Apache`
* `GPL`, `2` and `3`


## bugs

If `bugs` is formatted as a string:

```json
{
  "bugs": "https://github.com/assemble/generator-assemble/issues"
}
```

It will be normalized to:

```json
{
  "bugs": {
    "url": "https://github.com/assemble/generator-assemble/issues"
  }
}
```

## author

If `author` is formatted as a string:

```js
{
  "author": "Jon Schlinkert"
}
```

It will be normalized to:

```json
{
  "author": {
    "name": "Jon Schlinkert",
    "url": ""
  }
}
```

## repository

If `repository` is formatted as a string:

```js
{
  "repository": "https://github.com/assemble/generator-assemble.git",
}
```

It will be normalized to:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/assemble/generator-assemble.git"
  }
}
```

`repository.type` is determined based on a search of the `url` string.