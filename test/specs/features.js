'use strict';

var fs = require('fs');
var transform = require('../../lib');
var Metalsmith = require('metalsmith');



describe('metalsmith-transform', function(){

  it('append', function(done){
    new Metalsmith('test/fixtures/basic')
      .use(transform({
        action: 'append',
        value: ' World!'
      }))
      .build(function(err){
        if (err){
          return done(err);
        }

        var result = fs.readFileSync('test/fixtures/basic/build/test1.txt', 'utf8');
        if (result !== 'Normal Text File World!'){
          return done(result);
        }

        done();
      });
  });

  it('prepend', function(done){
    new Metalsmith('test/fixtures/basic')
      .use(transform({
        action: 'prepend',
        value: 'Hello! '
      }))
      .build(function(err){
        if (err){
          return done(err);
        }

        var result = fs.readFileSync('test/fixtures/basic/build/test1.txt', 'utf8');
        if (result !== 'Hello! Normal Text File'){
          return done(result);
        }

        done();
      });
  });

  it('wrap', function(done){
    new Metalsmith('test/fixtures/basic')
      .use(transform({
        action: 'wrap',
        value: ['hello ', ' world']
      }))
      .build(function(err){
        if (err){
          return done(err);
        }

        var result = fs.readFileSync('test/fixtures/basic/build/test1.txt', 'utf8');
        if (result !== 'hello Normal Text File world'){
          return done(result);
        }

        done();
      });
  });

  it('transform (fn)', function(done){
    new Metalsmith('test/fixtures/basic')
      .use(transform(function(data, m){
        data.contents = new Buffer(m._source + ' ' + m._destination);
        return data;
      }))
      .build(function(err){
        if (err){
          return done(err);
        }

        var result = fs.readFileSync('test/fixtures/basic/build/test1.txt', 'utf8');
        if (result !== 'src build'){
          return done(result);
        }

        done();
      });
  });

  it('transform (options)', function(done){
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

        var result = fs.readFileSync('test/fixtures/basic/build/test1.txt', 'utf8');
        if (result !== 'src build'){
          return done(result);
        }

        done();
      });
  });


  it('filtered', function(done){
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

        var result = fs.readFileSync('test/fixtures/filter/build/test1.txt', 'utf8');
        var result2 = fs.readFileSync('test/fixtures/filter/build/test2.html', 'utf8');

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

