const nodeExternals = require('webpack-node-externals');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/backend/index.ts',
    externals: [nodeExternals()],
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist', 'backend'),
    },
    target: 'node',
};
