var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify');

gulp.task('default', function() {
  browserify('./src/index.js')
    .bundle()
    .on('error', console.log)
    .pipe(source('index.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*', ['default']);
  gulp.watch('src/*', ['default']);
  gulp.watch('src/models/**/*', ['default']);
});
