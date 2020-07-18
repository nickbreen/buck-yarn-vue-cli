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
/* harmony import */ var _LinkFetcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _BuckResolver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);


const plugin = {
  resolvers: [_BuckResolver__WEBPACK_IMPORTED_MODULE_1__.BuckResolver],
  fetchers: [_LinkFetcher__WEBPACK_IMPORTED_MODULE_0__.LinkFetcher]
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);

/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LinkFetcher": () => /* binding */ LinkFetcher
/* harmony export */ });
/* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__);


const LINK_PROTOCOL = 'portal:';
class LinkFetcher {
  supports(locator, opts) {
    if (!locator.reference.startsWith(LINK_PROTOCOL)) return false;
    return true;
  }

  getLocalPath(locator, opts) {
    const {
      parentLocator,
      path
    } = _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.structUtils.parseFileStyleRange(locator.reference, {
      protocol: LINK_PROTOCOL
    });
    if (_yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.ppath.isAbsolute(path)) return path;
    const parentLocalPath = opts.fetcher.getLocalPath(parentLocator, opts);
    if (parentLocalPath === null) return null;
    return _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.ppath.resolve(parentLocalPath, path);
  }

  async fetch(locator, opts) {
    const {
      parentLocator,
      path
    } = _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.structUtils.parseFileStyleRange(locator.reference, {
      protocol: LINK_PROTOCOL
    }); // If the link target is an absolute path we can directly access it via its
    // location on the disk. Otherwise we must go through the package fs.

    const parentFetch = _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.ppath.isAbsolute(path) ? {
      packageFs: new _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.CwdFS(_yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.PortablePath.root),
      prefixPath: _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.PortablePath.dot,
      localPath: _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.PortablePath.root
    } : await opts.fetcher.fetch(parentLocator, opts); // If the package fs publicized its "original location" (for example like
    // in the case of "file:" packages), we use it to derive the real location.

    const effectiveParentFetch = parentFetch.localPath ? {
      packageFs: new _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.CwdFS(_yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.PortablePath.root),
      prefixPath: _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.ppath.relative(_yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.PortablePath.root, parentFetch.localPath)
    } : parentFetch; // Discard the parent fs unless we really need it to access the files

    if (parentFetch !== effectiveParentFetch && parentFetch.releaseFs) parentFetch.releaseFs();
    const sourceFs = effectiveParentFetch.packageFs;
    const sourcePath = _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.ppath.join(effectiveParentFetch.prefixPath, path);

    if (parentFetch.localPath) {
      return {
        packageFs: new _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.CwdFS(sourcePath, {
          baseFs: sourceFs
        }),
        releaseFs: effectiveParentFetch.releaseFs,
        prefixPath: _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.PortablePath.dot,
        localPath: sourcePath
      };
    } else {
      return {
        packageFs: new _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.JailFS(sourcePath, {
          baseFs: sourceFs
        }),
        releaseFs: effectiveParentFetch.releaseFs,
        prefixPath: _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.PortablePath.dot
      };
    }
  }

}

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@yarnpkg/core");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@yarnpkg/fslib");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BuckResolver": () => /* binding */ BuckResolver
/* harmony export */ });
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var readline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var readline__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(readline__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
/* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_core__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _LinkResolver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8);





const execFile = (0,util__WEBPACK_IMPORTED_MODULE_0__.promisify)(child_process__WEBPACK_IMPORTED_MODULE_1__.execFile);
class BuckResolver extends _LinkResolver__WEBPACK_IMPORTED_MODULE_4__.LinkResolver {
  supportsDescriptor(locator, opts) {
    return locator.range.startsWith('buck:');
  }

  supportsLocator(locator, opts) {
    return locator.reference.startsWith('buck:');
  }

  async getCandidates(descriptor, dependencies, opts) {
    const path = descriptor.range.slice('buck:'.length, descriptor.range.indexOf("::"));
    const {
      stdout
    } = await execFile('buck', ['targets', '--show-full-output', path]);
    const lines = (0,readline__WEBPACK_IMPORTED_MODULE_2__.createInterface)({
      input: stdout
    });
    const candidates = [];

    for await (const line of lines) {
      const [target, output] = line.split(/\s+/, 2);
      candidates.push(_yarnpkg_core__WEBPACK_IMPORTED_MODULE_3__.structUtils.makeLocator({ ...descriptor,
        name: target
      }, `portal:${output}`));
    }

    return candidates;
  }

}

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("util");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("readline");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LinkResolver": () => /* binding */ LinkResolver
/* harmony export */ });
/* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__);




const LINK_PROTOCOL = 'portal:';
class LinkResolver {
  supportsDescriptor(descriptor, opts) {
    if (!descriptor.range.startsWith(LINK_PROTOCOL)) return false;
    return true;
  }

  supportsLocator(locator, opts) {
    if (!locator.reference.startsWith(LINK_PROTOCOL)) return false;
    return true;
  }

  shouldPersistResolution(locator, opts) {
    return false;
  }

  bindDescriptor(descriptor, fromLocator, opts) {
    return _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.structUtils.bindDescriptor(descriptor, {
      locator: _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.structUtils.stringifyLocator(fromLocator)
    });
  }

  getResolutionDependencies(descriptor, opts) {
    return [];
  }

  async getCandidates(descriptor, dependencies, opts) {
    const path = descriptor.range.slice(LINK_PROTOCOL.length);
    return [_yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.structUtils.makeLocator(descriptor, `${LINK_PROTOCOL}${_yarnpkg_fslib__WEBPACK_IMPORTED_MODULE_1__.npath.toPortablePath(path)}`)];
  }

  async resolve(locator, opts) {
    if (!opts.fetchOptions) throw new Error(`Assertion failed: This resolver cannot be used unless a fetcher is configured`);
    const packageFetch = await opts.fetchOptions.fetcher.fetch(locator, opts.fetchOptions);
    const manifest = await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.miscUtils.releaseAfterUseAsync(async () => {
      return await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.Manifest.find(packageFetch.prefixPath, {
        baseFs: packageFetch.packageFs
      });
    }, packageFetch.releaseFs);
    return { ...locator,
      version: manifest.version || `0.0.0`,
      languageName: opts.project.configuration.get(`defaultLanguageName`),
      linkType: _yarnpkg_core__WEBPACK_IMPORTED_MODULE_0__.LinkType.SOFT,
      dependencies: new Map([...manifest.dependencies, ...manifest.devDependencies]),
      peerDependencies: manifest.peerDependencies,
      dependenciesMeta: manifest.dependenciesMeta,
      peerDependenciesMeta: manifest.peerDependenciesMeta,
      bin: manifest.bin
    };
  }

}

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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