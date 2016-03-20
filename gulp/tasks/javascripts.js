/**
 * Task for optimize js by webpack
 */
'use strict';

var gulp = require('gulp');
var path = require('path');
var taskUrl = require('../lib/createUrl');
var taskName = path.basename(__filename, '.js');

var config = require('../config');
var webpack = require("webpack");
var webpackConfig = require("../../webpack.config");
var gutil = require("gulp-util");

module.exports = function(runTimestamp) {
    // if get runTimestamp set mode production
    taskName += (runTimestamp) ? ':production': '';

    gulp.task(taskName, function (callback) {
        var myConfig = [];
        // update basic webpack config
        for (var i = 0; i < webpackConfig.length; i++) {
            // set entry points and base dir [context]
            myConfig[i] = Object.create(webpackConfig[i]);
            //myConfig[i].context = taskUrl('javascripts', 'src');
            myConfig[i].entry = config.tasks.javascripts.entries;

            //console.log(taskUrl('javascripts', 'src'));

            if (runTimestamp) {
                myConfig[i].output.path = taskUrl('javascripts', 'dist', runTimestamp);
                myConfig[i].output.publicPath = config.tasks.javascripts.publicPath + 'build_' + runTimestamp + '/javascripts/';
                myConfig[i].plugins = myConfig[i].plugins.concat(
                    new webpack.DefinePlugin({
                        "process.env": {
                            // This has effect on the react lib size
                            "NODE_ENV": JSON.stringify("production")
                        }
                    }),
                    new webpack.NoErrorsPlugin(),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false,
                            drop_console: true,
                            unsafe: true
                        }
                    })
                );
            } else {
                myConfig[i].output.path = taskUrl('javascripts', 'dist');
                myConfig[i].output.publicPath = '\\' + taskUrl('javascripts', 'dist') + '\\';
                myConfig[i].devtool = "source-map";
            }
        }

        // run webpack
        webpack(myConfig, function (err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
                colors: true,
                children: (runTimestamp) ? false : true
            }));
            callback();
        });
    });
};


