var gulp       = require('gulp'),
    path       = require('path'),
    rename     = require('gulp-rename');



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
gulp.task('default', ['svgstore']);

