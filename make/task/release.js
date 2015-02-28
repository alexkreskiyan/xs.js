'use strict';

module.exports = function () {

    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');
    var del = require('del');
    var sources = require('../sources');
    var pure = require('../pureFunctions');

    //scripts processing
    del(['build/release/*.js']);
    gulp.src(sources).pipe(concat('xs.js')).pipe(uglify({
        mangle: true,
        compress: {
            pure_funcs: Array.prototype.concat.apply([], [
                pure.log.internal,
                pure.log.contract,
                pure.assert.internal,
                pure.assert.contract
            ])
        }
    })).pipe(gulp.dest('build/release'));
};