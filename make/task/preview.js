'use strict';

module.exports = function () {

    var del = require('del');
    var sources = require('../sources');
    var gulp = require('gulp');
    var indent = require('gulp-indent');
    var wrap = require('gulp-wrap');
    var concat = require('gulp-concat');
    var merge = require('gulp-merge');
    var uglify = require('gulp-uglify');
    var pure = require('../pureFunctions');

    //remove old files
    del(['build/preview/*.js']);


    //get core stream
    var core = gulp.src(sources.core);

    //indent all sources
    core = core.pipe(indent({
        amount: 4
    }));

    //wrap all sources in core template
    core = core.pipe(wrap({
        src: 'make/template/core'
    }));


    //get modules stream
    var modules = gulp.src(sources.modules);

    //wrap all sources in modules template
    modules = modules.pipe(wrap({
        src: 'make/template/module'
    }));


    //get build stream
    var build = merge(core, modules);

    //concat all files
    build = build.pipe(concat({
        path: 'xs.js'
    }, {
        newLine: '\n\n\n'
    }));

    //indent concatenated file
    build = build.pipe(indent({
        amount: 4
    }));

    //wrap concatenated file in framework template
    build = build.pipe(wrap({
        src: 'make/template/framework'
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