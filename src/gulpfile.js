'use strict';

var fs = require('fs');
var gulp = require('gulp-help')(require('gulp'));
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var clean = require('gulp-clean');
var coveralls = require('gulp-coveralls');

require('jshint-stylish');

gulp.task('lint', 'Lints all server side js', function() {
    return gulp.src([
        './*.js',
        'lib/***/*.js',
        'app/**/*.js',
        'test/**/*.js'
    ]).pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', 'Runs all unit and API tests', function(cb) {
    gulp.src(['app/**/*.js', 'lib/**/*.js', 'app.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function() {
            gulp.src(['test/**/*.js'])
                .pipe(mocha({
                    reporter: 'spec',
                    timeout: 10000
                }))
                .pipe(istanbul.writeReports({
                    reporters: ['lcov', 'json', 'text', 'text-summary']
                }))
                .on('end', cb);
        });
});

gulp.task('coveralls', 'Pushes coverage data to coveralls.io', function() {
    return gulp.src('coverage/lcov.info')
        .pipe(coveralls());
});

gulp.task('clean-reports', 'Removes code coverage and reporting files', function() {
    return gulp.src(['./coverage', './report'], {
        read: false
    }).pipe(clean({
        force: true
    }));
});

gulp.task('build', 'Runs lint, tests and code coverage', function(callback) {
    runSequence(
        'clean-reports',
        'lint',
        'test',
        function() {
            process.exit(0); // Always close even if other processes are still running
            callback();
        });
});

gulp.task('ci', 'Runs CI server tasks', function(callback) {
    runSequence(
        'clean-reports',
        'lint',
        'test',
        'coveralls',
        function() {
            process.exit(0); // Alwayslose even if other processes are still running
            callback();
        });
});

gulp.task('default', 'Default task', ['build']);
