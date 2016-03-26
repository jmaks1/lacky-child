"use strict";

var webpack = require("webpack");
var path = require('path');
var I18nPlugin = require("i18n-webpack-plugin");
var BowerWebpackPlugin = require("bower-webpack-plugin");
var languages = {
    "en": null,
    "ru": require("./src/messages/lang.ru.json")
};

//console.log(path.join(__dirname, 'src/javascripts'));

module.exports = Object.keys(languages).map(function (language) {
    return {
        name: language,
        context: path.join(__dirname, 'src/javascripts'),
        entry: {},
        output: {
            filename: language + ".[name].js",
            chunkFilename: language + ".[hash].[name].js",
            library: "GJ"
        },
        plugins: [
            new I18nPlugin(
                languages[language]
            ),
            new webpack.DefinePlugin({
                'NODE_ENV': JSON.stringify('production'),
                'LANG': JSON.stringify(language)
            }),
            // detect bower components
            new BowerWebpackPlugin({
                modulesDirectories: ['bower_components'],
                manifestFiles: ['bower.json', '.bower.json'],
                includes: /.*/,
                excludes: [/.*\.less$/, /.*\.scss$/, /.*\.css$/, /\.woff$/, /\.ttf$/, /\.eot$/, /\.svg$/]
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            })
        ],
        resolve: {
            moduleDirectories: ['node_modules'],
            extensions: ['', '.js']
        },
        resolveLoader: {
            moduleDirectories: ['node_modules', 'src/javascripts/assets'],
            moduleTemplates: ['*-loader', '*'],
            extensions: ['', '.js']
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    include: [
                        path.resolve(__dirname, "src/javascripts")
                    ],
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        }
    }
});