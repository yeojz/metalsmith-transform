# metalsmith-transform
Contents manipulation plugin for metalsmith.

## About
`metalsmith-transform` is a [metalsmith](http://http://www.metalsmith.io/) plugin which allows manipulation of field in the metalsmith pipeline.

Methods are inspired by [gulp-insert](https://www.npmjs.com/package/gulp-insert).


## Usage

```
npm install metalsmith-transform
```

### API
```js
import transform from 'metalsmith-transform';
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

*A Note on CLI Usage*

Since JSON does not take functions, only `append`, `prepend` and `wrap` are accepted.

## Actions

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

### Transform

Calls a function with the `file` object and `metalsmith` instance.
Function should return the modified contents of the file.

```js
metalsmith.use(function(data, m){
  let contents = data.contents.toString().toUpperCase();
  data.contents = new Buffer(contents);

  return data;
})); 
```



