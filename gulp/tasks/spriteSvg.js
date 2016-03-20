/**
 * The task of create SVG sprite
 */
'use strict';

var gulp = require('gulp');
var path = require('path');
var taskUrl = require('../lib/createUrl');
var taskName = path.basename(__filename, '.js');

var config = require('../config');
var plumber = require('gulp-plumber');
var svgmin = require('gulp-svgmin');
var svgSprite = require('gulp-svg-sprite');

module.exports = function(runTimestamp) {
    // if get runTimestamp set mode production
    taskName += (runTimestamp) ? ':production': '';

    gulp.task(taskName, function () {
        return gulp.src(taskUrl('spriteSvg', 'src'))
            .pipe(plumber())
            .pipe(svgmin())
            .pipe(svgSprite({
                "shape": {
                    "spacing": {
                        "padding": 5
                    }
                },
                "mode": {
                    "css": {
                        "dest": config.root.baseDir,
                        "layout": "diagonal",
                        "sprite": taskUrl('spriteSvg', 'dist', runTimestamp) + "/sprite-svg.svg",
                        "bust": false,
                        "render": {
                            "scss": {
                                "dest": taskUrl('spriteSvg', 'core') + '/sprite-svg.scss',
                                "template": taskUrl('spriteSvg', 'template')
                            }
                        }
                    }
                }
            }))
            .pipe(plumber.stop())
            .pipe(gulp.dest(config.root.baseDir));
    });
};