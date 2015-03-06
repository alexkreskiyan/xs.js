'use strict';

module.exports = function () {

    var del = require('del');
    var sources = require('../sources');
    var gulp = require('gulp');

    //remove old files
    del(['build/source/*.js']);


    //get core stream
    var core = sources.core;

    //save build
    core.pipe(gulp.dest('build/source'));
};