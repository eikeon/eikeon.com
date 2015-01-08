(function () {
  'use strict';

  var gulp       = require('gulp'),
      browserify = require('browserify'),
      reactify = require('reactify'),
      buffer = require('vinyl-buffer'),
      transform = require('vinyl-transform'),
      uglify = require('gulp-uglify'),
      sourcemaps = require('gulp-sourcemaps'),
      concat     = require('gulp-concat'),
      imagemin   = require('gulp-imagemin'),
      autoprefixer   = require('gulp-autoprefixer'),
      connect = require('connect'),
      http = require('http'),
      handler = require('./server'),
      less = require('gulp-less'),
      path = require('path');

  gulp.task('scripts', function() {

    var browserified = transform(function(filename) {
      var b = browserify({
        entries: [filename],
        debug: true
      });
      return b.bundle();
    });

    return gulp.src(['./assets/js/site.js'])
      .pipe(browserified)
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./static/js'));
  });

  gulp.task('less', function () {
    gulp.src('assets/less/*.less')
      .pipe(sourcemaps.init())
      .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
      }))
      .pipe(autoprefixer())
      .pipe(concat('site.css'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./static/css'));
  });

  gulp.task('images', function () {
    gulp.src(['assets/images/*.jpg', 'assets/images/*.png', 'assets/images/*.svg'])
      .pipe(imagemin())
      .pipe(gulp.dest('static/images/'));

  });

  gulp.task('bootstrap', function () {
    gulp.src(['bower_components/bootstrap/dist/**'])
      .pipe(gulp.dest('./static/'));
  });

  gulp.task('ubuntu', function () {
    gulp.src(['ubuntu/**'])
      .pipe(gulp.dest('./static/ubuntu/'));
  });


  gulp.task('watch', function() {
    gulp.watch('assets/js/**/*.js', [ 'scripts' ]);
    gulp.watch('assets/less/*.less', [ 'less' ]);
    gulp.watch('assets/images/**/*', [ 'images' ]);
  });
  
  gulp.task('static', ['less', 'scripts', 'images', 'bootstrap', 'ubuntu' ]);

  gulp.task('webserver', function() {
    var app = connect()
        .use(require('morgan')('dev'))
        .use(require('serve-static')('public'))
        .use(handler);

    http.createServer(app).listen(3000);
  });

  gulp.task('default', ['static', 'webserver', 'watch']);

}());
