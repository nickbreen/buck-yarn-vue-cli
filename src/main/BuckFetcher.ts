import {readFile as cbReadFile} from 'fs'
import {promisify} from 'util'
import {
    Fetcher,
    FetchOptions,
    MinimalFetchOptions,
    Locator,
    structUtils,
    tgzUtils,
    MessageName,
    miscUtils, hashUtils
} from '@yarnpkg/core'
import {locatorPattern} from "./buck"
import {LazyFS, NodeFS, PortablePath, ppath, ZipFS} from "@yarnpkg/fslib";
import {getLibzipPromise} from '@yarnpkg/libzip';

const readFile = promisify(cbReadFile)

export class BuckFetcher implements Fetcher {
    supports(locator: Locator, opts: MinimalFetchOptions) {
        return locatorPattern.test(locator.reference)
    }

    getLocalPath(locator: Locator, opts: FetchOptions) {
        return null
    }

    async fetch(locator: Locator, opts: FetchOptions) {
        const locatorResult = locatorPattern.exec(locator.reference)
        opts.report.reportInfo(MessageName.UNNAMED, `Locator: ${locator.reference} => ${locatorResult.groups.proto}:${locatorResult.groups.package}`)

        const prefixPath = structUtils.getIdentVendorPath(locator)
        opts.report.reportInfo(MessageName.UNNAMED, `Prefix Path: ${prefixPath}`)

        let zipFs: ZipFS
        const packageFs: LazyFS<PortablePath> = new LazyFS<PortablePath>(() => miscUtils.prettifySyncErrors(async () => {
            return zipFs = await this.fetchFromPackage(locatorResult.groups.package, opts)
        }, message => {
            return `Failed to open the output for ${structUtils.prettyLocator(opts.project.configuration, locator)}: ${message}`
        }), ppath)

        const releaseFs = () => {
            if (zipFs)
            {
                zipFs.discardAndClose()
            }
        }
        const checksum = await hashUtils.checksumFile(locatorResult.groups.package)
        return {packageFs, releaseFs, prefixPath, checksum}
    }

    async fetchFromPackage(locator: Locator, opts: FetchOptions) {

        const locatorMatch = locatorPattern.exec(locator.reference)

        const tgzBuffer = await readFile(locatorMatch.groups.package)

        return await tgzUtils.convertToZip(tgzBuffer, {
            compressionLevel: opts.project.configuration.get(`compressionLevel`),
            prefixPath: structUtils.getIdentVendorPath(locator),
            stripComponents: 1,
        })
    }
}
