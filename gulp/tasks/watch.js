/**
 * Task for styles
 */
'use strict';

var gulp = require('gulp');
var path = require('path');
var taskUrl = require('../lib/createUrl');
var taskName = path.basename(__filename, '.js');

var watch = require('gulp-watch');

module.exports = function() {
    gulp.task(taskName, function(){
        watch([taskUrl('javascripts', 'watch')], function(event, cb) {
            gulp.start('javascripts');
        });
        watch([taskUrl('spritePng', 'watch')], function(event, cb) {
            gulp.start('spritePng');
        });
        watch([taskUrl('stylesheets', 'watch')], function(event, cb) {
            gulp.start('stylesheets');
        });
    });
};