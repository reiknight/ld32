var gulp = require('gulp'),
    jade = require('gulp-jade'),
    connect = require('gulp-connect'),
    TEMPLATE_FILES = ['src/templates/*.jade'];

gulp.task('templates', function () {
    gulp.src(TEMPLATE_FILES)
        .pipe(jade())
        .pipe(gulp.dest('public'))
        .pipe(connect.reload());
});

gulp.task('watch', ['build'], function () {
    gulp.watch(TEMPLATE_FILES, ['templates']);
});

gulp.task('server', function () {
    connect.server({
        root: 'public',
        livereload: true
    });
});

gulp.task('build', ['templates']);

gulp.task('default', ['watch', 'server']);
