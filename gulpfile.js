var gulp       = require('gulp'),
    plumber    = require('gulp-plumber'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    path       = require('path'),
    rename     = require('gulp-rename');


/**
 * JS
 *
 */
var paths_js_libs = [
    'public/js/libs/ol-angular.js',
    'public/js/libs/html2canvas.min.js',
    'public/js/libs/*.js',
    '!public/js/libs/*.map',
    '!public/js/libs/angular.min.js'
]
var uglify = require('gulp-uglify');
// Minify all AngularJS libs
gulp.task('js_libs', function() {

    return gulp.src(paths_js_libs)
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat('libs.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/dist'));
});
// Minify all Oneline Scripts
var paths_js_ol = [
    'public/js/core.js',
    'public/js/directives/*.js',
    'public/js/services/*.js',
    'public/js/controllers/*.js',
    'public/js/templates/*.js'
]
gulp.task('js_ol', function() {

    return gulp.src(paths_js_ol)
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat('oneline.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/dist'));
});

/**
 * CSS
 *
 */
var paths_css_ol = 'public/css/**/*.css'
var postcss = require('gulp-postcss');

gulp.task('css_ol', function () {

    var processors = [
        require('postcss-partial-import'),
        require('postcss-nested'),
        require('postcss-short'),
        require('postcss-apply'),
        require('postcss-cssnext')({
            autoprefixer: true
        }),
        require('cssnano')
    ];

    return gulp.src('public/css/main.css')
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(postcss(processors))
            .pipe(concat('oneline.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/dist'))
})

/**
 * HTML
 *
 */
var paths_html_index = [
    'views/*.html',
    '!views/*.min.html'
];
var minifyHTML = require('gulp-minify-html');
// Minify Oneline index page
gulp.task('html_index', function (){

    return gulp.src(paths_html_index)
        .pipe(minifyHTML())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('views'))
})
// Concatenate the Oneline HTML template files in the $templateCache
var paths_templates_ol = 'public/js/templates/html/**/*.html';
var ngTpCache = require('gulp-angular-templatecache');
gulp.task('templates_ol', function (){

    return gulp.src(paths_templates_ol)
        .pipe(ngTpCache({
            module: 'Oneline.templates',
            standalone: true
        }))
        .pipe(gulp.dest('public/js/templates'))
})

/**
 * SVG
 *
 */
var paths_svg_src = 'public/img/src/*.svg';

var svgmin   = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore');
// Minify & Combine
gulp.task('svgstore', function () {
    return gulp.src(paths_svg_src)
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(rename('icon-sprites.svg'))
        .pipe(gulp.dest('public/img'))
})



/**
 * Task
 *
 */
// Watch
gulp.task('watch', function() {

    gulp.watch(paths_js_ol, ['js_ol']);
    gulp.watch(paths_js_libs, ['js_libs']);
    gulp.watch(paths_css_ol, ['css_ol']);
    gulp.watch(paths_html_index, ['html_index']);
    gulp.watch(paths_templates_ol, ['templates_ol']);
    gulp.watch(paths_svg_src, ['svgstore']);
});
// Run
gulp.task('default', [
    'watch', 
    'templates_ol',
    'js_ol',
    'js_libs',
    'css_ol',
    'html_index',
    'svgstore'
]);

