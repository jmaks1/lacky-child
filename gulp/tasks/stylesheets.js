/**
 * Task for styles
 */
'use strict';

var gulp = require('gulp');
var path = require('path');
var taskUrl = require('../lib/createUrl');
var taskName = path.basename(__filename, '.js');

var plumber = require('gulp-plumber');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');


module.exports = function(runTimestamp) {
    // if get runTimestamp set mode production
    taskName += (runTimestamp) ? ':production' : '';

    gulp.task(taskName, function () {
        return gulp.src(taskUrl('stylesheets', 'src'))
            .pipe(plumber())
            .pipe(gulpif(!runTimestamp, sourcemaps.init()))
            .pipe(sass())
            .pipe(prefixer())
            .pipe(cssmin())
            .pipe(gulpif(!runTimestamp, sourcemaps.write()))
            .pipe(plumber.stop())
            .pipe(gulp.dest(taskUrl('stylesheets', 'dist', runTimestamp)));
    });
};