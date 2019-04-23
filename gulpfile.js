const gulp = require('gulp'),
    concat = require('gulp-concat'),
    autoprefix = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    cache = require('gulp-cached'),
    del = require('del'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    connect = require('gulp-connect-php'),
    imagemin = require('gulp-imagemin'),
    config = {
        server: {
            baseDir: "./build"
        },
        tunnel: false,
        host: 'localhost',
        port: 3333,
        logPrefix: "♥_trolizmaslom_♥"
    },
    src = {
        php: 'src/*.php',
        html: 'src/*.html',
        partsHtml: 'src/parts/*.html',
        csslib: 'src/scss/plugins/*.scss',
        cssdev: 'src/scss/*.scss',
        jslib: 'src/js/plugins/*.js',
        jsdev: 'src/js/*.js',
        images: 'src/images/**/*.*'
    },
    build = {
        images: 'build/images',
        css: 'build/css',
        js: 'build/js',
        html: 'build/',
    };

function img() {
    return  gulp.src(src.images)
        .pipe(cache())
        .pipe(gulp.dest(build.images))
        .pipe(browserSync.stream());
}
function imgmin() {
    return  gulp.src(src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(build.images))
}
function php() {
    return gulp.src(src.php)
        .pipe(rigger())
        .pipe(gulp.dest(build.html));
}
function html() {
    return gulp.src(src.html)
        .pipe(cache())
        .pipe(rigger())
        .pipe(gulp.dest(build.html));
}
function pluginsCSS(){
    return gulp.src(src.csslib)
        .pipe(cache())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('plugins.css'))
        .pipe(cleanCSS({level: 2}))
        .pipe(gulp.dest(build.css));
}
function devCSS() {
    return gulp.src(src.cssdev)
        .pipe(cache())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({level: 2}))
        .pipe(gulp.dest(build.css))
        .pipe(browserSync.stream());
}
function pluginsJS() {
    return gulp.src(src.jslib)
        .pipe(cache())
        .pipe(concat('plugins.js'))
        .pipe(uglify({
            toplevel:true
        }))
        .pipe(gulp.dest(build.js));
}
function devJS() {
    return gulp.src(src.jsdev)
        .pipe(cache())
        .pipe(gulp.dest(build.js))
        .pipe(browserSync.stream());
}
function cleanBuild() {
    return del(['build/*'])
}
function watch() {
    browserSync.init(config);
    gulp.watch(src.cssdev, devCSS);
    gulp.watch(src.jsdev, devJS).on('change', browserSync.reload);
    gulp.watch(src.images, img).on('change', browserSync.reload);
    gulp.watch(src.html, html).on('change', browserSync.reload);
    gulp.watch(src.partsHtml, html).on('change', browserSync.reload);
    gulp.watch(src.php, php).on('change', browserSync.reload);
}
gulp.task('connect', function() {
    connect.server({
        base: './build'
    });
});
gulp.task('img', img);
gulp.task('imgmin', imgmin);
gulp.task('php', php);
gulp.task('html', html);
gulp.task('cleanBuild', cleanBuild);
gulp.task('pluginsCSS', pluginsCSS);
gulp.task('devCSS', devCSS);
gulp.task('pluginsJS', pluginsJS);
gulp.task('devJS', devJS);
gulp.task('watch', watch);
gulp.task('build', gulp.series(
    'cleanBuild',
    gulp.parallel('devCSS', 'pluginsCSS', 'devJS', 'pluginsJS', 'html', 'php', 'img')
));
gulp.task('default', gulp.series('build', 'watch'));
gulp.task('php', gulp.series('build',
    gulp.parallel('watch', 'connect')
));