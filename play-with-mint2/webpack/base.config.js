var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//_dirname format /santaba/resources/mobile/config
var mobilePath = __dirname.slice(0, -7);
console.log(path)
module.exports = {
    context: mobilePath,
    entry: {
        app: mobilePath + '/app/main.js',
        vendor: ['jquery', 'underscore', 'backbone', 'b2', 'async', 'moment', 'fastclick', 'hammer']
        //'highcharts', 'highchartsMore', 'solidGauge' are on code spliting.
    },
    output: {
        path: mobilePath + '/dist',
        filename: '[name].js'
    },
    resolveLoader: {
        fallback: ['../node_modules'],
    },
    resolve: {
        modulesDirectories: [mobilePath + '/app', 'node_modules'],
        fallback: ['../node_modules'],
        extensions: ['', '.js', '.vue'],
        alias: {
            'jquery': mobilePath + '/libs/jquery-2.1.1.js',
            'underscore': mobilePath + '/libs/underscore.js',
            'backbone': mobilePath + '/libs/backbone.js',
            'b2': mobilePath + '/libs/b2.js',
            'async': mobilePath + '/libs/async.js',
            'base64': mobilePath + '/libs/base64.js',
            'md5': mobilePath + '/libs/md5.js',
            'sha': mobilePath + '/libs/sha.js',
            'moment': mobilePath + '/libs/moment.js',
            'fastclick': mobilePath + '/libs/fastclick.js',
            'hammer': mobilePath + '/libs/hammer.js',
            'vue': mobilePath + '/libs/vue.js',
            'vuerouter': mobilePath + '/libs/vue-router.js',
            'vuex': mobilePath + '/libs/vuex.js',

            //common js
            'core': mobilePath + '/app/commons/core.js',
            'utils': mobilePath + '/app/commons/utils.js',
            'ModelUrls': mobilePath + '/app/models/ModelUrls.js',
            'searchBox': mobilePath + '/app/commons/SearchBox.js',
            'alertCount': mobilePath + '/app/commons/AlertCount/AlertCount.js',
            'inputMsgBox': mobilePath + '/app/commons/inputMsgBox/InputMsgBox.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader'
                    },
                }
            },
            // {
            //     test: /\.js$/,
            //     loader: 'babel-loader',
            //     query: {
            //         presets: ['es2015', 'stage-2'],
            //         plugins: ['transform-runtime']
            //     },
            //     include: mobilePath,
            //     exclude: /node_modules/
            // },

            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(['raw-loader', 'sass-loader?outputStyle=compressed'])
            }
        ]
    },
    plugins: [
        //:= require('jquery'), require('underscore'), require('backbone') in every file
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     _:'underscore',
        //     Backbone: 'backbone'
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            chunks: ["app"]
        }),
        // extract css into its own file
        new ExtractTextPlugin('./[name].css')
    ]
};

