const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [{
    mode: "development",
    entry: {
        'index': `${__dirname}/src/index.js`,
    },
    externals: {
        "gsap": "window"
    },
    output: {
        path: `${__dirname}/dist`,
        filename: `[name].js`
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: `${__dirname}/fill`, to: './' },
        ], {
            copyUnmodified: true
        }),
    ],
}];