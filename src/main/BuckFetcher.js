"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuckFetcher = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const core_1 = require("@yarnpkg/core");
const buck_1 = require("./buck");
const fslib_1 = require("@yarnpkg/fslib");
const readFile = util_1.promisify(fs_1.readFile);
class BuckFetcher {
    supports(locator, opts) {
        return buck_1.locatorPattern.test(locator.reference);
    }
    getLocalPath(locator, opts) {
        return null;
    }
    async fetch(locator, opts) {
        const locatorResult = buck_1.locatorPattern.exec(locator.reference);
        opts.report.reportInfo(core_1.MessageName.UNNAMED, `Locator: ${locator.reference} => ${locatorResult.groups.proto}:${locatorResult.groups.package}`);
        const prefixPath = core_1.structUtils.getIdentVendorPath(locator);
        opts.report.reportInfo(core_1.MessageName.UNNAMED, `Prefix Path: ${prefixPath}`);
        let zipFs;
        const packageFs = new fslib_1.LazyFS(() => core_1.miscUtils.prettifySyncErrors(async () => {
            return zipFs = await this.fetchFromPackage(locatorResult.groups.package, opts);
        }, message => {
            return `Failed to open the output for ${core_1.structUtils.prettyLocator(opts.project.configuration, locator)}: ${message}`;
        }), fslib_1.ppath);
        const releaseFs = () => {
            if (zipFs) {
                zipFs.discardAndClose();
            }
        };
        const checksum = await core_1.hashUtils.checksumFile(locatorResult.groups.package);
        return { packageFs, releaseFs, prefixPath, checksum };
    }
    async fetchFromPackage(locator, opts) {
        const locatorMatch = buck_1.locatorPattern.exec(locator.reference);
        const tgzBuffer = await readFile(locatorMatch.groups.package);
        return await core_1.tgzUtils.convertToZip(tgzBuffer, {
            compressionLevel: opts.project.configuration.get(`compressionLevel`),
            prefixPath: core_1.structUtils.getIdentVendorPath(locator),
            stripComponents: 1,
        });
    }
}
exports.BuckFetcher = BuckFetcher;
