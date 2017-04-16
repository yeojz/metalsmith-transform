import multimatch from 'multimatch';
import each from 'async/each';

function setOptions(opt) {

  // Set action to transform if `function` is passed in.
  // Pattern set to all since transform function should do the filtering.
  if (typeof opt === 'function') {
    return {
      action: 'transform',
      callback: opt,
      pattern: '**/*'
    }
  }

  // If any other action type,
  // Read and set defaults
  return {
    action: opt.action || 'append',
    pattern: opt.pattern || '**/*',
    value: opt.value || ''
  }
}

function applyStandardOperations(contents, options) {
  // Appends the string to the contents
  if (options.action === 'append') {
    return contents + options.value;
  }

  // Prepends the string to the contents
  if (options.action === 'prepend') {
    return options.value + contents;
  }

  // Prepends arr[0] and appends arr[1] to the contents
  // Will prepend by default.
  if (options.action === 'wrap') {
    if (Array.isArray(options.value)) {
      const pre = options.value[0] || '';
      const post = options.value[1] || '';
      return pre + contents + post;
    }

    return options.value + contents;
  }

  return contents;
}

function applyTransform(data, options, metalsmith) {
  if (typeof options.callback === 'function'){
    return options.callback(data, metalsmith);
  }
  return options.value(data, metalsmith);
}

function applyActions(data, options, metalsmith) {
  if (options.action === 'transform') {
    return applyTransform(data, options, metalsmith);
  }

  let contents = data.contents.toString();
  contents = applyStandardOperations(contents, options);
  data.contents = new Buffer(contents);
  return data;
}

function transform(opt = {}) {
  let options = setOptions(opt == null ? {} : opt);

  return (files, metalsmith, done) => {
    const matchedFiles = multimatch(Object.keys(files), options.pattern);

    each(matchedFiles, (file, callback) => {
      const data = Object.assign({}, files[file]);
      files[file] = applyActions(data, options, metalsmith);
      callback();
    }, done);
  };
}

module.exports = transform;
