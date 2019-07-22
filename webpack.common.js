const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main/js/app.tsx',
    cache: true,
    output: {
        path: __dirname + "/src/main/resources/static/built/",
        filename: '[name].[contenthash].js',
        publicPath: "/built/"
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.less', '.css' ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/main/js/documents.ejs',
            filename: 'index.html'
        })
    ],
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }, {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS,
                        options: {
                            javascriptEnabled: true
                        }
                    },
                ]
            }
        ]
    }
};