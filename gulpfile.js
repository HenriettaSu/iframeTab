'use strict';
var gulp = require('gulp'),
    changed = require('gulp-changed'),
    sass = require('gulp-sass'),
    autoPrefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    mocha = require('gulp-mocha'),
    pump = require('pump'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    bs = require('browser-sync').create();

var buildSass = 'build/sass/*.scss',
    buildSassSrc = 'build/sass/',
    buildCss = 'build/css/*.css',
    buildCssSrc = 'build/css',
    buildJs = 'build/js/*.js',
    distCssSrc = 'dist/css',
    distJsSrc = 'dist/js';

// sass to css
gulp.task('sass-to-css', function(){
  return gulp.src(buildSass)
      .pipe(changed(buildSass))
      .pipe(sass().on('error', function (e) {
        console.error(e.message);
      }))
      .pipe(autoPrefixer({
        browsers: ['last 99 versions']
      }))
      .pipe(gulp.dest(buildCssSrc))
      .pipe(concat('iframeTab.css'))
      .pipe(gulp.dest(buildCssSrc));
});

// css minify
gulp.task('minify-css', function() {
  return gulp.src(buildCss)
      .pipe(changed(buildCss))
      .pipe(cleanCSS({ compatibility: 'ie8' }))
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

// watch sass
gulp.task('watch-sass', function (done) {
  gulp.watch(buildSass, ['sass-to-css'])
      .on('end', done);
});
// watch css
gulp.task('watch-css', function (done) {
  gulp.watch(buildCss, ['minify-css'])
      .on('end', done);
});
// watch js
gulp.task('watch-js', function (done) {
  gulp.watch(buildJs, ['jscompress'])
      .on('end', done);
});

// watch
gulp.task('watch', ['watch-sass', 'watch-css', 'watch-js']);

// browser-sync
gulp.task('browser-sync',function() {
  bs.init({
    server: {
      baseDir: "./"
    },
    //tunnel: "henriettaSu",
    //online: true
    /*
     * server為靜態服務器，運行此會導致一個頁面被同時打開多個（a和b）的情況下，修改a窗口時，b窗口頁面也會被修改
     * 需要測試功能的時候，開啟tunnel和online即可
     * 開啟後會非常卡，建議測試結束後關掉
    */
  });
  gulp.watch("./dist/**/*.*").on('change', bs.reload);
});

//gulp
gulp.task('default',['watch','browser-sync']);