/* eslint global-require: 0 */
'use strict';

const gulp   = require('gulp');
const path   = require('path');
const rename = require('gulp-rename');

/**
 * Minify & Combine SVG
 *
 */
const svgmin   = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const SVG_PATH = 'public/img/svg/*.svg';

gulp.task('svgstore', () => {
    return (
        gulp.src(SVG_PATH)
        .pipe(svgmin(file => {
            const prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: `${prefix}-`,
                        minify: true,
                    },
                }],
            };
        }))
        .pipe(svgstore())
        .pipe(rename('icon-sprites.svg'))
        .pipe(gulp.dest('public/dist'))
    );
});

/**
 * CSS
 *
 */
const postcss = require('gulp-postcss');
const CSS_PATH = 'views/styles/src/*.css';

gulp.task('css', () => {
    const processors = [
        require('postcss-import')({
            path: ['public/css'],
        }),
        require('postcss-nested'),
        require('postcss-short'),
        require('postcss-assets')({
            loadPaths: ['public/img/assets'],
        }),
        require('postcss-cssnext')({
            autoprefixer: true,
        }),
        require('css-mqpacker'),
        require('cssnano'),
    ];

    return (
        gulp.src(CSS_PATH)
        .pipe(postcss(processors))
        .pipe(gulp.dest('views/styles/dist'))
    );
});

/**
 * Task
 *
 */
gulp.task('default', ['svgstore', 'css']);

