'use strict';

module.exports = function () {

    var del = require('del');
    var sources = require('../sources');
    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var merge = require('gulp-merge');

    //remove old files
    del([ 'build/debug/*.js' ]);


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


    //save build
    build.pipe(gulp.dest('build/debug'));
};