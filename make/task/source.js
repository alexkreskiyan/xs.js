'use strict';

module.exports = function () {

    var del = require('del');
    var sources = require('../sources');
    var gulp = require('gulp');
    var indent = require('gulp-indent');
    var wrap = require('gulp-wrap');
    var concat = require('gulp-concat');

    //remove old files
    del(['build/source/*.js']);


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
    //concat all files
    var build = core.pipe(concat({
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


    //save build
    build.pipe(gulp.dest('build/source'));
};