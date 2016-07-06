'use strict';
var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    changed = require('gulp-changed'),
    sass = require('gulp-sass'),
    autoPrefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    mocha = require('gulp-mocha'),
    pump = require('pump'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create();

// file path
var buildSass = 'build/sass/*.scss';
var buildSassSrc = 'build/sass/';
var buildCss = 'build/css/*.css';
var buildCssSrc = 'build/css';
var buildJs = 'build/js/*.js';
var distCss = 'dist/css/*.css';
var distCssSrc = 'dist/css';
var distJsSrc = 'dist/js';

//sass to css
gulp.task('sass-to-css', function(){
  return gulp.src(buildSass)
      .pipe(changed(buildSass))
      .pipe(sass().on('error', function (e) {
        console.error(e.message);
      }))
      .pipe(autoPrefixer({
        browsers: ['last 99 versions'],
        cascade: false
      }))
      .pipe(gulp.dest(buildCssSrc))
      .pipe(concat('iframeTab.css'))
      .pipe(gulp.dest(buildCssSrc));
});

//css minify
gulp.task('minify-css', function() {
  return gulp.src(buildCss)
      .pipe(changed(buildCss))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(distCssSrc));
});

// js minify
gulp.task('jscompress', function (cb) {
  pump([
        gulp.src(buildJs),
        uglify(),
        rename({ suffix: '.min' }),
        gulp.dest(distJsSrc)
      ],
      cb
  );
});

//watch sass
gulp.task('watch-sass', function (done) {
  gulp.watch(buildSass, ['sass-to-css'])
      .on('end', done);
});
//watch css
gulp.task('watch-css', function (done) {
  gulp.watch(buildCss, ['minify-css'])
      .on('end', done);
});
//watch js
gulp.task('watch-js', function (done) {
  gulp.watch(buildJs, ['jscompress'])
      .on('end', done);
});
//前端开发版
gulp.task('watch', ['watch-sass', 'watch-css', 'watch-js']);
// browser-sync
gulp.task('browser-sync',function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch("./dist/**/*.*").on('change', browserSync.reload);
});
//gulp
gulp.task('default',['watch','browser-sync']);