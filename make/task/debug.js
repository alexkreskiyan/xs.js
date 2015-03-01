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
    del(['build/debug/*.js']);


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


    //get main stream
    var main = merge(entry, core);

    //indent files
    main = main.pipe(indent({
        amount: 4
    }));

    //concat files
    main = main.pipe(concat({
        path: 'xs.js'
    }, {
        newLine: '\n\n\n'
    }));

    //wrap concatenated file in framework template
    main = main.pipe(wrap({
        src: 'make/template/framework'
    }));


    //get modules stream
    var modules = gulp.src(sources.modules);

    //wrap all sources in modules template
    modules = modules.pipe(wrap({
        src: 'make/template/module'
    }));


    //get build stream
    var build = merge(main, modules);

    //concat all files
    build = build.pipe(concat({
        path: 'xs.js'
    }, {
        newLine: '\n\n\n'
    }));


    //save build
    build.pipe(gulp.dest('build/debug'));
};