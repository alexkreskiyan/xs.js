var gulp = require('gulp');

var concat = require('gulp-concat');
var uglifyJS = require('gulp-uglify');
//var minifyCSS = require('gulp-minify-css');
//var compass = require('gulp-compass');
//var spritesmith = require('gulp.spritesmith');

var del = require('del');


//get sources file
var src = require('./source.json');

var scripts = ['src/xs.js'];

//add core
scripts = scripts.concat(src.core.map(function (name) {

    'use strict';

    return name.split('xs.').join('src/').split('.').join('/') + '.js';
}));

//add modules
scripts = scripts.concat(Object.keys(src.modules).map(function (name) {

    'use strict';

    return name.split('xs.').join('src/').split('.').join('/') + '.js';
}));

//define paths
var paths = {
    scripts: scripts
};

var pureFunctions = {
    candidate: ['xs.log']
};
pureFunctions.release = pureFunctions.candidate.concat([
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
    'xs.assert.implements'
]);


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
        mangle: true,
        compress: {
            pure_funcs: pureFunctions.candidate,
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
            pure_funcs: pureFunctions.release,
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