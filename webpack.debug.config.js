module.exports = [{
    mode: "development",
    watch: true,
    entry: {
        'index': `${__dirname}/debug/index.js`,
    },
    output: {
        path: `${__dirname}/dist`,
        filename: `[name].js`
    },
}];