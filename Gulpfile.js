(function () {
  'use strict';

  var gulp       = require('gulp'),
      browserify = require('browserify'),
      reactify = require('reactify'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      uglify = require('gulp-uglify'),
      sourcemaps = require('gulp-sourcemaps'),
      concat     = require('gulp-concat'),
      imagemin   = require('gulp-imagemin'),
      connect = require('connect'),
      http = require('http'),
      handler = require('./server'),
      less = require('gulp-less'),
      path = require('path');

  gulp.task('styles', function () {
    gulp.src(['assets/css/styles.css'])
      .pipe(concat('styles.css'))
      .pipe(gulp.dest('./static/'));
  });

  gulp.task('scripts', function() {

    var bundler = browserify({
      entries: ['./assets/js/site.js'],
      debug: true
    });

    var bundle = function() {
      return bundler
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
      // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./static/js/'));
    };

    return bundle();
  });

  gulp.task('less', function () {
    gulp.src('assets/less/*.less')
      .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
      }))
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
    gulp.watch('assets/css/**/*.css', [ 'styles' ]);
    gulp.watch('assets/images/**/*', [ 'images' ]);
  });
  
  gulp.task('static', ['styles', 'less', 'scripts', 'images', 'bootstrap', 'ubuntu' ]);

  gulp.task('webserver', function() {
    var app = connect()
        .use(require('morgan')('dev'))
        .use(require('serve-static')('public'))
        .use(handler);

    http.createServer(app).listen(3000);
  });

  gulp.task('default', ['static', 'webserver', 'watch']);

}());
