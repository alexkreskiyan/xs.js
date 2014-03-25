var gulp = require('gulp');

var concat = require('gulp-concat');

var paths = {
	scripts: [
		'src/xs.js',
		'src/promise/*.js',
		'src/data/*.js',
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