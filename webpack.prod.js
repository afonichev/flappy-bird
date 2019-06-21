const path = require('path');

const dist = path.join(__dirname, 'dist');

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, 'src', 'main.js'),
    output: {
        path: dist,
        filename: path.join('js', 'bundle.js')
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