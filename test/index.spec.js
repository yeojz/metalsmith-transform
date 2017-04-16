import fs from 'fs';
import Metalsmith from 'metalsmith';
import transform from '../src/index';

describe('metalsmith-transform', function() {

  [
    [
      {
        action: 'append',
        value: ' World!'
      },
      '[append] should return expected result',
      'Normal Text File World!'
    ],
    [
      {
        action: '',
        value: ' World!'
      },
      '[append] should append by default',
      'Normal Text File World!'
    ],
    [
      {
      },
      '[append] should append by default and default empty value',
      'Normal Text File'
    ],
    [
      null,
      '[append] should do defaults on null options',
      'Normal Text File'
    ],

    [
      void 0,
      '[append] should do defaults on undefined options',
      'Normal Text File'
    ],
    [
      {
        action: 'prepend',
        value: 'Hello! '
      },
      '[prepend] should return expected result',
      'Hello! Normal Text File'
    ],
    [
      {
        action: 'wrap',
        value: ['Hello ', ' world']
      },
      '[wrap] should return expected result',
      'Hello Normal Text File world'
    ],
    [
      {
        action: 'wrap',
        value: ['Hello ']
      },
      '[wrap] should return expected result',
      'Hello Normal Text File'
    ],
    [
      {
        action: 'wrap',
        value: [null, ' World!']
      },
      '[wrap] should return expected result',
      'Normal Text File World!'
    ],
    [
      {
        action: 'wrap',
        value: 'World! '
      },
      '[wrap] should prepend when value is not array',
      'World! Normal Text File'
    ],
    [
      {
        action: 'outofthisworld',
        value: 'World! '
      },
      'should just return contents when unknown action is set',
      'Normal Text File'
    ],
  ].forEach(([action, text, expected], id) => {
    it(`[#${id}] ${text}`, function(done){
      new Metalsmith('test/fixtures/basic')
        .use(transform(action))
        .build(function(err){
          if (err){
            done(err)
            return;
          }

          const result = fs.readFileSync('test/fixtures/basic/build/test1.txt', 'utf8');

          if (result !== expected){
            return done(result);
          }

          done();
        });
    });
  });

  it('[transform] should be configurable via function argument', function(done){
    new Metalsmith('test/fixtures/basic')
      .use(transform(function(data, m){
        data.contents = new Buffer(m._source + ' ' + m._destination);
        return data;
      }))
      .build(function(err){
        if (err){
          return done(err);
        }

        const result = fs.readFileSync('test/fixtures/basic/build/test1.txt', 'utf8');
        if (result !== 'src build'){
          return done(result);
        }

        done();
      });
  });

  it('[transform] should be configurable via options object', function(done){
    new Metalsmith('test/fixtures/basic')
      .use(transform({
        action: 'transform',
        value: function(data, m){
          data.contents = new Buffer(m._source + ' ' + m._destination);
          return data;
        }
      }))
      .build(function(err){
        if (err){
          return done(err);
        }

        const result = fs.readFileSync('test/fixtures/basic/build/test1.txt', 'utf8');
        if (result !== 'src build'){
          return done(result);
        }

        done();
      });
  });


  it('should not apply to files that do not match patterns', function(done){
    new Metalsmith('test/fixtures/filter')
      .use(transform({
        action: 'append',
        value: ' World!',
        pattern: '**/*.txt'
      }))
      .build(function(err){
        if (err){
          return done(err);
        }

        const result = fs.readFileSync('test/fixtures/filter/build/test1.txt', 'utf8');
        const result2 = fs.readFileSync('test/fixtures/filter/build/test2.html', 'utf8');

        if (result !== 'Normal Text File World!'){
          return done(result);
        }

        if (result2 !== '<div>HTML FILE</div>'){
          return done(result2);
        }

        done();
      });
  });

});
