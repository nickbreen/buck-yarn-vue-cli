import {
    Descriptor,
    LinkType,
    Locator,
    Manifest,
    MessageName,
    MinimalResolveOptions,
    miscUtils,
    Package,
    ResolveOptions,
    Resolver,
    structUtils
} from '@yarnpkg/core'

import {descriptorPattern, locatorPattern, targetOutputs} from "./buck";

export class BuckResolver implements Resolver {
    supportsDescriptor(descriptor: Descriptor, opts: MinimalResolveOptions) {
        return descriptorPattern.test(descriptor.range)
    }

    supportsLocator(locator: Locator, opts: MinimalResolveOptions) {
        return locatorPattern.test(locator.reference)
    }

    shouldPersistResolution(locator: Locator, opts: MinimalResolveOptions) {
        return false;
    }

    bindDescriptor(descriptor: Descriptor, fromLocator: Locator, opts: MinimalResolveOptions) {
        return structUtils.bindDescriptor(descriptor, {
            locator: structUtils.stringifyLocator(fromLocator),
        });
    }

    getResolutionDependencies(descriptor: Descriptor, opts: MinimalResolveOptions) {
        return [];
    }

    async getCandidates(descriptor: Descriptor, dependencies, opts: ResolveOptions) {
        const buckTarget = descriptorPattern.exec(descriptor.range);
        opts.report.reportInfo(MessageName.UNNAMED, `Descriptor: ${descriptor.range} => ${buckTarget.groups.proto}:${buckTarget.groups.cell}//${buckTarget.groups.path}:${buckTarget.groups.rule}`)

        const outputsByTarget = await targetOutputs([buckTarget.groups.target]);

        const candidates = []

        for (const [target, output] of outputsByTarget) {
            candidates.push(structUtils.makeLocator({...descriptor, name: target}, `buck:${output}`))
            opts.report.reportInfo(MessageName.UNNAMED, `Candidate: ${target} => ${output}`)
        }

        return candidates
    }

    async resolve(locator: Locator, opts: ResolveOptions): Promise<Package> {
        if (!opts.fetchOptions)
            throw new Error(`Assertion failed: This resolver cannot be used unless a fetcher is configured`);

        const packageFetch = await opts.fetchOptions.fetcher.fetch(locator, opts.fetchOptions);

        const manifest = await miscUtils.releaseAfterUseAsync(async () => {
            return await Manifest.find(packageFetch.prefixPath, {baseFs: packageFetch.packageFs});
        }, packageFetch.releaseFs);

        return {
            ...locator,

            version: manifest.version || `0.0.0`,

            languageName: opts.project.configuration.get(`defaultLanguageName`),
            linkType: LinkType.SOFT,

            dependencies: new Map([...manifest.dependencies, ...manifest.devDependencies]),
            peerDependencies: manifest.peerDependencies,

            dependenciesMeta: manifest.dependenciesMeta,
            peerDependenciesMeta: manifest.peerDependenciesMeta,

            bin: manifest.bin,
        };
    }
}