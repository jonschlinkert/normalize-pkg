'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var unused = require('gulp-unused');
var eslint = require('gulp-eslint');

var lint = ['index.js', 'lib/**/*.js'];

gulp.task('coverage', function() {
  return gulp.src(lint)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['coverage'], function() {
  return gulp.src('test/*.js')
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports());
});

gulp.task('lint', function() {
  return gulp.src(lint.concat(['test/*.js', 'gulpfile.js']))
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('unused', function() {
  var keys = Object.keys(require('./lib/utils.js'));
  return gulp.src(['*.js', 'lib/**/*.js'])
    .pipe(unused({keys: keys}));
});

gulp.task('default', ['test', 'lint']);
