var gulp = require('gulp'),
    babel = require('gulp-babel'),
    rename = require("gulp-rename"),
    browserify = require('browserify'),
    babelify = require('babelify'),
    sourceStream = require('vinyl-source-stream'),
    transform = require('vinyl-transform'),
    streamify = require('gulp-streamify')
    uglify = require('gulp-uglify'),
    exorcist = require('exorcist'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    imageResize = require('gulp-image-resize'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('connect'),
    http = require('http'),
    less = require('gulp-less'),
    path = require('path');

gulp.task('browserify', function() {
    var b = browserify({
        debug: true
    });
    b.transform(babelify, {
        presets: ['es2015', 'react'],
        plugins: ['transform-object-rest-spread']
    });
    b.add('./assets/js/site.js');
    return b.bundle()
        .pipe(sourceStream('site.js'))
        .pipe(transform(function() {
            return exorcist('dist/static/js/site.js.map');
        }))
        .pipe(streamify(uglify()))
        .pipe(rename(function (path) {
              path.extname = '.js';
        }))
        .pipe(gulp.dest('./dist/static/js'));
});

gulp.task('server', () => {
	return gulp.src('./assets/js/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
            presets: ['es2015', 'react'],
            plugins: ['transform-object-rest-spread']
        }))
		//.pipe(concat('all.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('less', function() {
    gulp.src('assets/less/*.less')
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefixer())
        .pipe(concat('site.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/static/css'));
});

gulp.task('images', function() {
    gulp.src(['assets/images/*.jpg', 'assets/images/*.png', 'assets/images/*.svg'])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/static/images/'));
});

gulp.task('photos', function() {
    gulp.src(['assets/photos/*.png'])
        .pipe(imageResize({
            format: 'jpg'
        }))
        .pipe(gulp.dest('dist/static/images/'));
});

gulp.task('bootstrap', function() {
    gulp.src(['bower_components/bootstrap/dist/fonts/**'])
        .pipe(gulp.dest('./dist/static/fonts/'));
});

gulp.task('ubuntu', function() {
    gulp.src(['ubuntu/**'])
        .pipe(gulp.dest('./dist/static/ubuntu/'));
});

gulp.task('static-root', function() {
    gulp.src(['assets/robots.txt', 'assets/favicon.ico'])
        .pipe(gulp.dest('./dist/static/'));
});


gulp.task('watch', function() {
    gulp.watch('assets/js/*.js', ['browserify']);
    gulp.watch('assets/less/*.less', ['less']);
    gulp.watch('assets/images/*', ['images']);
    gulp.watch('assets/photos/*', ['photos']);
});

gulp.task('static', ['static-root', 'less', 'browserify', 'images', 'photos', 'bootstrap', 'ubuntu']);

gulp.task('default', ['server', 'static']);
