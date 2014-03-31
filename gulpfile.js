var gulp = require('gulp');

var concat = require('gulp-concat');

var paths = {
	scripts: [
		'src/xs.js',
		'src/Detect.js',
		'src/lang/Object.js',
		'src/lang/Array.js',
		'src/lang/Set.js',
		'src/lang/Attribute.js',
		'src/lang/Date.js',
		'src/lang/Error.js',
		'src/lang/Function.js',
		'src/lang/Number.js',
		'src/lang/String.js',
		'src/class/Base.js',
		'src/class/Class.js',
		'src/class/ClassManager.js',
		'src/class/Loader.js',
		'src/util/Observable.js',
		'src/promise/Deferred.js',
		'src/promise/Promise.js',
		'src/promise/Resolver.js',
		'src/data/Connection.js',
		'src/Ajax.js'
	]
};

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(concat('xs.js'))
    .pipe(gulp.dest('build'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts']);