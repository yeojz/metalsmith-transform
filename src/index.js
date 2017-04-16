import multimatch from 'multimatch';
import {each} from 'async';

export default function(opt = {}){

  let options = {};

  // Set action to transform if `function` is passed in.
  // Pattern set to all since transform function should do the filtering.
  if (typeof opt === 'function'){
    options.action = 'transform';
    options.pattern = '**/*';


  // If any other action type,
  // Read and set defaults
  } else {
    options.action = opt.action || 'append';
    options.pattern = opt.pattern || '**/*';
    options.value = opt.value || '';
  }


  // Actual Return
  return (files, metalsmith, done) => {

    each(multimatch(Object.keys(files), options.pattern), (file, callback) => {
      let data = files[file];
      let contents = data.contents.toString();

      switch(options.action){

        // Appends the string to the contents
        case 'append':
          contents = contents + options.value;
          break;

        // Prepends the string to the contents
        case 'prepend':
          contents = options.value + contents;
          break;

        // Prepends arr[0] and appends arr[1] to the contents
        // Will prepend by default.
        case 'wrap':

          // Check for Array.
          if (Array.isArray(options.value)){
            contents = (options.value[0] || '') + contents;
            contents = contents + (options.value[1] || '');

          // Prepends as default
          } else {
            contents = options.value + contents;
          }
          break;

        case 'transform':
          let results;

          if (typeof opt === 'function'){
            results = opt(data, metalsmith);
          } else {
            results = options.value(data, metalsmith);
          }

          files[file] = results;
          break;
      }


      // Common Processing
      if (options.action !== 'transform'){
        data.contents = new Buffer(contents);
      }


      callback();

    }, done); // end each
  };
}
