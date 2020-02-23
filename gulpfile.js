'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const scssSrc = './src/scss/*.scss';

sass.compiler = require('node-sass');

gulp.task('sass', () => {
    return gulp.src(scssSrc)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', () => {
    gulp.watch(scssSrc, gulp.parallel('sass'));
});

gulp.task('copy-js', () => {
    return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-js:watch', () => {
    gulp.watch('./src/js/*.js', gulp.parallel('copy-js'));
});

gulp.task('watch', gulp.parallel('sass:watch', 'copy-js:watch'));

gulp.task('copy-html', () => {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', gulp.parallel('sass', 'copy-js', 'copy-html'));
