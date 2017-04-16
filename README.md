# metalsmith-transform

> Transform or manipulate file objects in the metalsmith pipeline

[![npm][npm-badge]][npm-link]
[![Build Status][circle-badge]][circle-link]
[![Coverage Status][coveralls-badge]][coveralls-link]

## About

`metalsmith-transform` is a [metalsmith](http://http://www.metalsmith.io/) plugin which allows the use of custom functions to manipulate the file object in a metalsmith pipeline.

Furthermore, instead of writing a full plugin, you can just pass in the transformation function into this instead.

String methods are inspired by [gulp-insert](https://www.npmjs.com/package/gulp-insert).


## Installation

```
$ npm install metalsmith-transform
```

or 

```
$ yarn add metalsmith-transform
```

## Usage

### API

```js
import transform from 'metalsmith-transform';
```

You can pass in an object or a function as an argument. i.e.

```js
metalsmith.use(transform(function(fileObject, metalsmithData){
  return fileObject
}));

// or

metalsmith.use(transform({
  action: '', // append / prepend / wrap / transform
  value: '', // string | function (only if using transform)
  pattern: '*.md'
}));
```


### CLI

```json
"plugins": {
  "metalsmith-transform": {
    "action": "append",
    "value": "Include Me!"
  }
}
```

**Note on CLI Usage:** Since JSON does not take functions, only `append`, `prepend` and `wrap` actions are accepted.


## Available Actions

By default, if an action is not defined, `append` is assumed.

### Transform

Calls a function with the `file` object and `metalsmith` instance.
Function should return the modified contents of the file.

```js
metalsmith.use(transform(function(data, m){
  let contents = data.contents.toString().toUpperCase();
  data.contents = new Buffer(contents);

  return data;
}));
```

### Append

Appends a string onto the contents.

```js
// Appends 'world' to the contents of every file
metalsmith.use(transform({
  action: 'append',
  value: 'world'
}));
```

### Prepend

Prepends a string onto the contents.

```js
// Prepends 'Hello' to the contents of every file
metalsmith.use(transform({
  action: 'prepend',
  value: 'hello'
}));
```

### Wrap

Wraps the contents with two strings.

```js
// prepends 'hello' and appends 'world' to the contents
metalsmith.use(transform({
  action: 'wrap',
  value: ['hello', 'world']
}));
```

[npm-badge]: https://img.shields.io/npm/v/metalsmith-transform.svg?style=flat-square
[npm-link]: https://www.npmjs.com/package/metalsmith-transform

[circle-badge]: https://img.shields.io/circleci/project/github/yeojz/metalsmith-transform/master.svg?style=flat-square
[circle-link]: https://circleci.com/gh/yeojz/metalsmith-transform.svg

[coveralls-badge]: https://img.shields.io/coveralls/yeojz/metalsmith-transform/master.svg?style=flat-square
[coveralls-link]: https://coveralls.io/github/yeojz/metalsmith-transform
