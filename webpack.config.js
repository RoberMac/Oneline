const path = require('path');
const webpack = require('webpack');

const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'public/js');
const ENTRY_PATH = path.resolve(APP_PATH, 'entry');
const BUILD_PATH = path.resolve(ROOT_PATH, 'public/dist');

module.exports = {
    entry: {
        app: [path.resolve(ENTRY_PATH, 'app')],
        share: [path.resolve(ENTRY_PATH, 'share')]
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: APP_PATH,
                // exclude: /(node_modules|bower_components)/,
                loaders: ['babel']
            },
            { test: /\.json$/, loader: "json" },
            { test: /\.css$/, loaders: ['style', 'css', 'postcss'] },
            {
                test: /\.svg$/,
                loader: 'svg-sprite',
                query: {
                    prefixize: false
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json', '.coffee'],
        alias: {
            'components': path.resolve(APP_PATH, 'components'),
            'routes': path.resolve(APP_PATH, 'routes'),
            'state': path.resolve(APP_PATH, 'state'),
            'utils': path.resolve(APP_PATH, 'utils'),
            'images': path.resolve(ROOT_PATH, 'public/img'),
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: process.env.NODE_ENV === 'development' || false,
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common.js'
        }),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ],
    postcss: function (webpack){
        return [
            require('postcss-import')({
                path: ['public/css'],
                addDependencyTo: webpack
            }),
            require('postcss-nested'),
            require('postcss-short'),
            require('postcss-assets')({ loadPaths: ['public/img/assets'] }),
            require('postcss-cssnext')({
                autoprefixer: true
            }),
            require('css-mqpacker'),
            require('lost'),
            // require('cssnano'),
        ]
    }
};