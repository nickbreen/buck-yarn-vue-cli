import {Plugin} from '@yarnpkg/core';
import {LinkFetcher} from './LinkFetcher';
import {BuckResolver} from './BuckResolver';

const plugin: Plugin = {
    resolvers: [BuckResolver],
    fetchers: [LinkFetcher]
};

export default plugin;

