'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    twig = require('gulp-twig'),
    data = require('gulp-data'),
    clean = require('gulp-clean'),
    path = require('path'),
    prettify = require('gulp-html-prettify'),
    browserSync = require('browser-sync').create();

gulp.task('clean-css', function () {
  return gulp.src('./app/css/*.*', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-html', function () {
  return gulp.src('./app/*.*', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('sass', gulp.parallel('clean-css', function(){
  return gulp.src('./scss/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream());
}));

var getJsonData = function(file) {
  var json = './' + path.basename(file.path, '.twig') + '.json';
  delete require.cache[require.resolve(json)];
  return require(json);
};

gulp.task('twig', gulp.parallel('clean-html', function(){
  return gulp.src('./index.twig')
    .pipe(data(getJsonData))
    .pipe(twig())
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./app'));
}));

gulp.task('watch', function () {
  browserSync.init({
    server: "./app"
  });
  gulp.watch('./scss/**/*.scss', gulp.series(['sass']));
  gulp.watch('**/*.twig', gulp.series(['twig']));
  gulp.watch('**/*.json', gulp.series(['twig']));
  gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series(['watch']));
