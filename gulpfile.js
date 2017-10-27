"use strict";

var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var mqpacker = require("css-mqpacker");
var del = require("del");
var gulp = require("gulp");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var rename = require("gulp-rename");
var run = require("run-sequence");

gulp.task("style", function() {
  gulp.src("src/scss/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]}),
      mqpacker ({
        sort: true
      })
    ]))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream())
});

gulp.task("html:copy", function() {
  return gulp.src("src/**/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("html:update", ["html:copy"], function(done) {
  server.reload();
  done();
});

gulp.task("serve", function() {
  server.init({
    server: "build/"
  });

  gulp.watch("src/scss/**/*.scss", ["style"]);
  gulp.watch("src/**/*.html", ["html:update"]);
});

gulp.task("images", function() {
  return gulp.src("src/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "src/**/*.html"
  ], {
    base: "./src"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    fn
  );
});
