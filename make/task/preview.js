'use strict';

module.exports = function () {

    var del = require('del');
    var sources = require('../sources');
    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var merge = require('gulp-merge');
    var uglify = require('gulp-uglify');
    var pure = require('../pureFunctions');

    //remove old files
    del([ 'build/preview/*.js' ]);


    //get core stream
    var core = sources.core;

    //get modules stream
    var modules = sources.modules;


    //get build stream
    var build = merge(core, modules);

    //concat all files
    build = build.pipe(concat({
        path: 'xs.js'
    }, {
        newLine: '\n\n\n'
    }));

    //uglify
    build = build.pipe(uglify({
        mangle: false,
        output: {
            beautify: true,
            comments: true,
            semicolons: false
        },
        compress: {
            pure_funcs: Array.prototype.concat.apply([], [
                pure.log.internal,
                pure.log.contract,
                pure.assert.internal,
                pure.assert.contract
            ]),
            sequences: false,
            unused: false
        }
    }));


    //save build
    build.pipe(gulp.dest('build/preview'));
};