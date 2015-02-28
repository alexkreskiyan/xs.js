'use strict';

module.exports = function () {

    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var del = require('del');
    var sources = require('../sources');

    //scripts processing
    del(['build/debug/*.js']);
    gulp.src(sources).pipe(concat('xs.js')).pipe(gulp.dest('build/debug'));
};