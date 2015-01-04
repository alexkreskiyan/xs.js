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

var pureFunctions = [
    'xs.log',
    'xs.assert.equal',
    'xs.assert.ok',
    'xs.assert.not',
    'xs.assert.object',
    'xs.assert.array',
    'xs.assert.fn',
    'xs.assert.string',
    'xs.assert.number',
    'xs.assert.boolean',
    'xs.assert.regExp',
    'xs.assert.error',
    'xs.assert.null',
    'xs.assert.iterable',
    'xs.assert.primitive',
    'xs.assert.numeric',
    'xs.assert.defined',
    'xs.assert.empty',
    'xs.assert.Class',
    'xs.assert.Interface',
    'xs.assert.instance',
    'xs.assert.inherits',
    'xs.assert.implements',
    'xs.assert.mixins'
];


//preview mode
gulp.task('preview', function () {

    'use strict';

    //scripts processing
    del(['build/preview/*.js']);
    gulp.src(paths.scripts).pipe(concat('xs.js')).pipe(gulp.dest('build/preview'));
});

//candidate mode
gulp.task('candidate', function () {

    'use strict';

    //scripts processing
    del(['build/candidate/*.js']);
    gulp.src(paths.scripts).pipe(concat('xs.js')).pipe(uglifyJS({
        mangle: false,
        compress: {
            pure_funcs: pureFunctions,
            drop_console: true
        }
    })).pipe(gulp.dest('build/candidate'));
});

//release mode
gulp.task('release', function () {

    'use strict';

    //scripts processing
    del(['build/release/*.js']);
    gulp.src(paths.scripts).pipe(concat('xs.js')).pipe(uglifyJS({
        mangle: true,
        compress: {
            pure_funcs: pureFunctions,
            drop_console: true
        }
    })).pipe(gulp.dest('build/release'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
    'preview',
    'candidate',
    'release'
]);