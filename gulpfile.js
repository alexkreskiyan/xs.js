var gulp = require('gulp');

var concat = require('gulp-concat');
var uglifyJS = require('gulp-uglify');
//var minifyCSS = require('gulp-minify-css');
//var compass = require('gulp-compass');
//var spritesmith = require('gulp.spritesmith');

var del = require('del');


//get sources list
var src = require('./src/src.json');

//map sources list to scripts list
var scripts = src.map(function (name) {

    'use strict';

    return name.split('xs.').join('src/').split('.').join('/') + '.js';
});

//add entry point
scripts.unshift('src/xs.js');

//define paths
var paths = {
    scripts: scripts
};

//preview mode
gulp.task('preview', function () {

    'use strict';

    //scripts processing
    del(['build/preview/*.js']);
    gulp.src(paths.scripts).pipe(concat('xs.js')).pipe(gulp.dest('build/preview'));
});

//release mode
gulp.task('release', function () {

    'use strict';

    //scripts processing
    del(['build/release/*.js']);
    gulp.src(paths.scripts).pipe(concat('xs.js')).pipe(uglifyJS({
        mangle: false,
        compress: {
            pure_funcs: ['xs.log'],
            drop_console: true
        }
    })).pipe(gulp.dest('build/release'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
    'preview',
    'release'
]);