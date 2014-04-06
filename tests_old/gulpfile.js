var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var closureCompiler = require('gulp-closure-compiler');

var paths = {
    scripts: [
        'src/xs.js',
        'src/lang/Object.js',
        'src/lang/Array.js',
        'src/lang/Set.js',
        'src/Detect.js',
        'src/lang/Attribute.js',
        'src/lang/Date.js',
        'src/lang/Error.js',
        'src/lang/Function.js',
        'src/lang/Number.js',
        'src/lang/String.js',
        'src/class/Class.js',
        'src/class/ClassManager.js',
        'src/class/Base.js',
        'src/class/Loader.js',
        'src/util/Observable.js',
        'src/promise/Deferred.js',
        'src/promise/Promise.js',
        'src/promise/Resolver.js',
        'src/data/Connection.js',
        'src/draw/Color.js',
        'src/Ajax.js'
    ]
};

gulp.task('build uncompressed', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.scripts)
        .pipe(concat('xs.js'))
        .pipe(gulp.dest('build/uncompressed'));
});

gulp.task('build minified', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.scripts)
        .pipe(uglify())
//        .pipe(closureCompiler())
        .pipe(concat('xs.min.js'))
        .pipe(gulp.dest('build/minified'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build uncompressed', 'build minified']);