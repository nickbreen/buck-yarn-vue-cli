/* eslint-disable */
module.exports = {
name: "@yarnpkg/plugin-buck",
factory: function (require) {
var plugin;plugin =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _BuckResolver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _BuckFetcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);


const plugin = {
  resolvers: [_BuckResolver__WEBPACK_IMPORTED_MODULE_0__.BuckResolver],
  fetchers: [_BuckFetcher__WEBPACK_IMPORTED_MODULE_1__.BuckFetcher]
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);

/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(2);
const buck_1 = __webpack_require__(3);
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


/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@yarnpkg/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const child_process_1 = __webpack_require__(4);
const readline_1 = __webpack_require__(5);
exports.locatorPattern = /(?<proto>buck):(?<package>.+)/;
// buck build target pattern from https://buck.build/concept/build_target.html
exports.descriptorPattern = /(?<proto>buck):(?<target>(?<cell>[A-Za-z0-9._-]*)\/\/(?<path>[A-Za-z0-9/._-]*):(?<rule>[A-Za-z0-9_/.=,@~+-]+))/;
async function targetOutputs(targets) {
    const { stdout } = child_process_1.execFile('buck', ['targets', '--show-full-output', ...targets]);
    const lines = readline_1.createInterface({ input: stdout });
    const outputsByTarget = new Map();
    for await (const line of lines) {
        const [target, output] = line.split(/\s+/, 2);
        outputsByTarget.set(target, output);
    }
    return outputsByTarget;
}
exports.targetOutputs = targetOutputs;


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("readline");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs_1 = __webpack_require__(7);
const util_1 = __webpack_require__(8);
const core_1 = __webpack_require__(2);
const buck_1 = __webpack_require__(3);
const fslib_1 = __webpack_require__(9);
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


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("util");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@yarnpkg/fslib");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })()
;
return plugin;
}
};