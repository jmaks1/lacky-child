/**
 * Main gulp file
 */
'use strict';

var gulp = require('gulp');
var gutil = require("gulp-util");
var gulpSequence = require('gulp-sequence');
var requireDir = require('require-dir');


var runTimestamp = Math.round(Date.now() / 1000);
// Require all tasks in gulp/tasks
var task = requireDir('./gulp/tasks', { recurse: true });

// init all tasks
task.javascripts();
task.spritePng();
task.stylesheets();
task.watch();

// init all production tasks
task.javascripts(runTimestamp);
task.spritePng(runTimestamp);
task.stylesheets(runTimestamp);

gulp.task('development', function (cb) {
    gulpSequence(
        'javascripts',
        'spritePng',
        'stylesheets',
        'watch'
    )(cb);
});

gulp.task('production', function (cb) {
    gutil.log(gutil.colors.red('build_' + runTimestamp));
    gulpSequence(
        'javascripts:production',
        'spritePng:production',
        'stylesheets:production'
    )(cb);
});