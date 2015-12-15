const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: [path.resolve(__dirname, 'public/js/entry')],
        vendor: [
            'react',
            'react-dom',
            'react-addons-css-transition-group',
            'react-addons-update',
            'react-redux',
            'redux',
            'react-router',
            'history',
            'superagent',
            'redux-simple-router',
            'redux-thunk',
            'classnames',
            'es6-promise',
            'react-timeago',            
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, 'public/js'),
                loaders: ['babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-2']
            },
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.css$/,  loader: "style-loader!css-loader!postcss-loader" }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.coffee'] 
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ],
    postcss: function (webpack){
        return [
            require('postcss-import')({ addDependencyTo: webpack }),
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