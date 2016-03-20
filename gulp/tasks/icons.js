/**
 * Task for optimize images
 */
'use strict';

var gulp = require('gulp');
var path = require('path');
var taskUrl = require('../lib/createUrl');
var taskName = path.basename(__filename, '.js');

var plumber = require('gulp-plumber');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

module.exports = function(runTimestamp) {
    // if get runTimestamp set mode production
    taskName += (runTimestamp) ? ':production': '';

    gulp.task(taskName, function () {
        return gulp.src(taskUrl('icons', 'src'))
            .pipe(iconfont({
                fontName: 'GloriaJeans',
                formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
                normalize: true,
                fontHeight: 1001,
                timestamp: runTimestamp || Math.round(Date.now() / 1000)
            }))
            .on('glyphs', function (glyphs, options) {
                gulp.src(taskUrl('icons', 'template'))
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs.map(function (glyph) {
                            // this line is needed because gulp-iconfont has changed the api from 2.0
                            return {
                                name: glyph.name,
                                codepoint: glyph.unicode[0].charCodeAt(0)
                            }
                        }),
                        fontName: 'GloriaJeans',
                        fontPath: '../fonts/',
                        className: 'gj'
                    }))
                    .pipe(gulp.dest(taskUrl('icons', 'core')));
            })
            .pipe(gulp.dest(taskUrl('icons', 'dist', runTimestamp)));
    });
};