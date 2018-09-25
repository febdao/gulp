var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create();

gulp.task('default', function(){
  console.log('Hello world!');
});

gulp.task('prefix', function(){
  gulp.src('style.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  browserSync.init({
    server: "./app"
  });
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});
