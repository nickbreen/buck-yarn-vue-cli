const {resolve} = require('path')

const cacheRoot = !!process.env.CACHE_DIR ? require('find-cache-dir')() : require('os').tmpdir();

const webpackCacheDir = resolve(cacheRoot, 'webpack');
const vueCacheDir = resolve(cacheRoot, 'vue-loader');
const babelCacheDir = resolve(cacheRoot, 'babel-loader');
const eslintCacheDir = resolve(cacheRoot, 'eslint-loader');
const terserCacheDir = resolve(cacheRoot, 'terser-webpack-plugin');

module.exports = {

    chainWebpack: config => {

        config.resolve.symlinks(false)

        // ensure that these do not try to cache in ./node_modules/.cache
        config.cache({type: 'filesystem', cacheDirectory: webpackCacheDir})
        /* config.module.rule('vue').use('cache-loader') */
        config.module.rule('vue').use('cache-loader')
            .tap(options => Object.assign(options, {cacheDirectory: vueCacheDir}))
        /* config.module.rule('vue').use('vue-loader') */
        config.module.rule('vue').use('vue-loader')
            .tap(options => Object.assign(options, {cacheDirectory: vueCacheDir}))
        /* config.module.rule('js').use('cache-loader') */
        config.module.rule('js').use('cache-loader')
            .tap(options => Object.assign(options, {cacheDirectory: babelCacheDir}))
        /* config.module.rule('eslint').use('eslint-loader') */
        config.module.rule('eslint').use('eslint-loader')
            .tap(options => Object.assign(options, {cache: eslintCacheDir}))
        /* config.optimization.minimizer('terser') */
        config.optimization
            .minimizer('terser')
            .init((Plugin, args) => {
                args[0].cache = terserCacheDir
                return new Plugin(...args)
            });
    }
}