"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BuckResolver_1 = require("./BuckResolver");
const BuckFetcher_1 = require("./BuckFetcher");
const plugin = {
    resolvers: [BuckResolver_1.BuckResolver],
    fetchers: [BuckFetcher_1.BuckFetcher]
};
exports.default = plugin;
