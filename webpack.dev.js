const path = require('path');

const dist = path.join(__dirname, 'dist');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src', 'main.js'),
    output: {
        path: dist,
        filename: path.join('js', 'bundle.js')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: dist
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};