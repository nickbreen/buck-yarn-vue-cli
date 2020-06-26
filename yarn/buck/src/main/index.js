exports.module = {
    name: 'plugin-buck',
    description: 'delegates to Buck to resolve buck: dependencies',
    factory: require => {
        // What is this `require` function, you ask? It's a `require`
        // implementation provided by Yarn core that allows you to
        // access various packages (such as @yarnpkg/core) without
        // having to list them in your own dependencies - hence
        // lowering your plugin bundle size, and making sure that
        // you'll use the exact same core modules as the rest of the
        // application.
        //
        // Of course, the regular `require` implementation remains
        // available, so feel free to use the `require` you need for
        // your use case!

        const {LinkFetcher} = require("@yarnpkg/plugin-link/lib/LinkFetcher");
        const BuckResolver = require('./BuckResolver')

        return {
            resolvers: [BuckResolver],
            fetchers: [LinkFetcher]
        }

    }
};
