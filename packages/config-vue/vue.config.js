module.exports = {
    chainWebpack: config => {
        //
        // config.optimization.minimizer("terser").tap(args => {
        //     const [options] = args
        //     options.cache = false
        //     return args
        // })

        // config.module
        //     .rule('vue')
        //     .use('vue-loader')
        //     .loader('vue-loader')
        //     .tap(options => Object.assign({}, options, {
        //         cacheDirectory: false
        //     }))
        //     .end()
        //     .use('cache-loader')
        //     .loader('cache-loader')
        //     .tap(options => Object.assign({}, options, {
        //         cacheDirectory: false
        //     }))

        // config.module
        //     .rule('eslint')
        //     .use('eslint-loader')
        //     .loader('eslint-loader')
        //     .tap(options => Object.assign({}, options, {
        //         cacheDirectory: false
        //     }))

        // config.module
        //     .rule('js')
        //     .use('babel-loader')
        //     .loader('babel-loader')
        //     .tap(options => Object.assign({}, options, {
        //         cacheDirectory: false
        //     }))

        // config.module
        //     .rule('js')
        //     .use('cache-loader')
        //     .loader('cache-loader')
        //     .tap(options => Object.assign({}, options, {
        //         cacheDirectory: false
        //     }))
    }
}