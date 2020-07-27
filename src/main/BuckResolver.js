"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuckResolver = void 0;
const core_1 = require("@yarnpkg/core");
const buck_1 = require("./buck");
class BuckResolver {
    supportsDescriptor(descriptor, opts) {
        return buck_1.descriptorPattern.test(descriptor.range);
    }
    supportsLocator(locator, opts) {
        return buck_1.locatorPattern.test(locator.reference);
    }
    shouldPersistResolution(locator, opts) {
        return false;
    }
    bindDescriptor(descriptor, fromLocator, opts) {
        return core_1.structUtils.bindDescriptor(descriptor, {
            locator: core_1.structUtils.stringifyLocator(fromLocator),
        });
    }
    getResolutionDependencies(descriptor, opts) {
        return [];
    }
    async getCandidates(descriptor, dependencies, opts) {
        const buckTarget = buck_1.descriptorPattern.exec(descriptor.range);
        opts.report.reportInfo(core_1.MessageName.UNNAMED, `Descriptor: ${descriptor.range} => ${buckTarget.groups.proto}:${buckTarget.groups.cell}//${buckTarget.groups.path}:${buckTarget.groups.rule}`);
        const outputsByTarget = await buck_1.targetOutputs([buckTarget.groups.target]);
        const candidates = [];
        for (const [target, output] of outputsByTarget) {
            candidates.push(core_1.structUtils.makeLocator({ ...descriptor, name: target }, `buck:${output}`));
            opts.report.reportInfo(core_1.MessageName.UNNAMED, `Candidate: ${target} => ${output}`);
        }
        return candidates;
    }
    async resolve(locator, opts) {
        if (!opts.fetchOptions)
            throw new Error(`Assertion failed: This resolver cannot be used unless a fetcher is configured`);
        const packageFetch = await opts.fetchOptions.fetcher.fetch(locator, opts.fetchOptions);
        const manifest = await core_1.miscUtils.releaseAfterUseAsync(async () => {
            return await core_1.Manifest.find(packageFetch.prefixPath, { baseFs: packageFetch.packageFs });
        }, packageFetch.releaseFs);
        return {
            ...locator,
            version: manifest.version || `0.0.0`,
            languageName: opts.project.configuration.get(`defaultLanguageName`),
            linkType: core_1.LinkType.SOFT,
            dependencies: new Map([...manifest.dependencies, ...manifest.devDependencies]),
            peerDependencies: manifest.peerDependencies,
            dependenciesMeta: manifest.dependenciesMeta,
            peerDependenciesMeta: manifest.peerDependenciesMeta,
            bin: manifest.bin,
        };
    }
}
exports.BuckResolver = BuckResolver;
