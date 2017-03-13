const path = require('path');

// Including plugin to extract the compiled css and save that to seperate file
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//Plugin to relaod pages automatically on every save
//var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    entry: {
        botanics: ['./src/js/app.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist/js/'),
        filename: '[name].js',
        publicPath: 'dist/js/'
    },
    module: {
        rules: [{
                test: /\.js$/,
                loaders: 'babel-loader',
                options: {
                    presets: ["latest"]
                },
                exclude: '/node_modules/'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ["css-loader", "sass-loader"]
                })
            },
            {
                test: /\.(woff2?|svg)$/,
                loader: 'url-loader?limit=10000'
            },
            {
                test: /\.(ttf|eot)$/,
                loader: 'file-loader'
            }
        ]
    },
    devServer: {
        port: 9000,
        contentBase: "./"
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '../css/style.css',
            allChunks: true
        })
        /*,
                new LiveReloadPlugin({
                    port: 9000
                })*/
    ]
};