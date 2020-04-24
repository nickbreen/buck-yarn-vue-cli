module.exports = {
    module: {
        rules: [{
            loader: "babel-loader",
            options: {
                rootMode: "upward",
                cacheDirectory: false
            }
        },{
            loader: "eslint-loader",
            options: {
                cache: false
            }
        }]
    },
}