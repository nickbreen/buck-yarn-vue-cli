import {Plugin} from '@yarnpkg/core';
import {BuckResolver} from './BuckResolver';
import {BuckFetcher} from "./BuckFetcher";

const plugin: Plugin = {
    resolvers: [BuckResolver],
    fetchers: [BuckFetcher]
};

export default plugin;

