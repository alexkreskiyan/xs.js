'use strict';

module.exports = function () {

    var del = require('del');
    var sources = require('../sources');
    var gulp = require('gulp');
    var indent = require('gulp-indent');
    var wrap = require('gulp-wrap');
    var concat = require('gulp-concat');
    var merge = require('gulp-merge');

    //remove old files
    del(['build/source/*.js']);


    //get entry stream
    var entry = gulp.src(sources.entry);


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


    //get build stream
    var build = merge(entry, core);

    //indent files
    build = build.pipe(indent({
        amount: 4
    }));

    //concat all files
    build = build.pipe(concat({
        path: 'xs.js'
    }, {
        newLine: '\n\n\n'
    }));

    //wrap concatenated file in framework template
    build = build.pipe(wrap({
        src: 'make/template/framework'
    }));


    //save build
    build.pipe(gulp.dest('build/source'));
};