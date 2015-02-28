'use strict';

var gulp = require('gulp');

//source task. concat core only
gulp.task('source', require('./make/task/source'));

//debug task. concat only
gulp.task('debug', require('./make/task/debug'));

//preview task. concat, no asserts, no logs
gulp.task('preview', require('./make/task/preview'));

//candidate task. concat, uglify, no logs. Is needed fo performance tests
gulp.task('candidate', require('./make/task/candidate'));

//release task. concat, uglify, no logs, no asserts
gulp.task('release', require('./make/task/release'));

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
    'source',
    'debug',
    'preview',
    'candidate',
    'release'
]);