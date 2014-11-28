var gulp = require('gulp');

var concat = require('gulp-concat');
var uglifyJS = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var watch = require('gulp-watch');
var compass = require('gulp-compass');
var spritesmith = require('gulp.spritesmith');

var del = require('del');

var karma = require('karma').server;

var paths = {
    scripts: [
        'src/xs.js',
        'src/lang/Detect.js',
        'src/lang/List.js',
        'src/lang/Attribute.js',
        'src/lang/Function.js',
        'src/lang/String.js'
        //        'src/Environment.js',
        //        'src/lang/Attribute.js',
        //        'src/lang/Date.js',
        //        'src/lang/Error.js',
        //        'src/lang/Function.js',
        //        'src/lang/Number.js',
        //        'src/lang/String.js',
        //        'src/class/Class.js',
        //        'src/class/ClassManager.js',
        //        'src/class/Base.js',
        //        'src/class/Loader.js',
        //        'src/util/Observable.js',
        //        'src/promise/Deferred.js',
        //        'src/promise/Promise.js',
        //        'src/promise/Resolver.js',
        //        'src/data/Connection.js',
        //        'src/draw/Color.js',
        //        'src/Ajax.js'
    ]
};

gulp.task('debug', function ( done ) {
    //scripts processing
    var buildScripts = function () {
        del(['build/debug/*.js']);
        gulp.src(paths.scripts).pipe(concat('xs.js')).pipe(gulp.dest('build/debug'));
    };

    //initial scripts build
    buildScripts();

    //watch scripts change
    watch(paths.scripts, {
        name: 'JS debug compiler'
    }, buildScripts);
});

gulp.task('test', function ( done ) {
    karma.start({
        configFile: __dirname + '/karma.js',
        singleRun: true
    }, done);
});

gulp.task('release', function () {
    //scripts processing
    var buildScripts = function () {
        del(['build/release/*.js']);
        gulp.src(paths.scripts).pipe(concat('xs.js')).pipe(uglifyJS()).pipe(gulp.dest('build/release'));
    };

    //initial scripts build
    buildScripts();

    //watch scripts change
    watch(paths.scripts, {
        name: 'JS debug compiler'
    }, buildScripts);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
    'debug',
    'release'
]);