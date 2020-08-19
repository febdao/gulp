'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    twig = require('gulp-twig'),
    data = require('gulp-data'),
    path = require('path'),
    prettify = require('gulp-html-prettify'),
    browserSync = require('browser-sync').create();

gulp.task('sass', function(){
  return gulp.src('./scss/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  browserSync.init({
    server: "./app"
  });
  gulp.watch('./scss/**/*.scss', gulp.series(['sass']));
  gulp.watch('**/*.twig', gulp.series(['twig']));
  gulp.watch('**/*.json', gulp.series(['twig']));
  gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});

var getJsonData = function(file) {
  return require('./' + path.basename(file.path, '.twig') + '.json');
};

gulp.task('twig', function(){
  var twig = require('gulp-twig');
  return gulp.src('./index.twig')
    .pipe(data(getJsonData))
    .pipe(twig())
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./app'));
})

gulp.task('default', gulp.series(['watch']));
