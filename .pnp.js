#!/usr/bin/env node
/* eslint-disable */

try {
  Object.freeze({}).detectStrictMode = true;
} catch (error) {
  throw new Error(`The whole PnP file got strict-mode-ified, which is known to break (Emscripten libraries aren't strict mode). This usually happens when the file goes through Babel.`);
}

var __non_webpack_module__ = module;

function $$SETUP_STATE(hydrateRuntimeState, basePath) {
  var path = require('path');
  var dataLocation = path.resolve(__dirname, ".pnp.data.json");
  return hydrateRuntimeState(require(dataLocation), {basePath: basePath || path.dirname(dataLocation)});
  }

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["pnpHook"] = factory();
	else
		root["pnpHook"] = factory();
})(global, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 398:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "uY": () => /* binding */ FakeFS,
  "fS": () => /* binding */ BasePortableFakeFS
});

// UNUSED EXPORTS: normalizeLineEndings

// EXTERNAL MODULE: external "os"
var external_os_ = __webpack_require__(87);

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(747);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);

// EXTERNAL MODULE: ../yarnpkg-fslib/sources/path.ts
var path = __webpack_require__(9);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/algorithms/copyPromise.ts

 // 1980-01-01, like Fedora

const defaultTime = 315532800;
async function copyPromise(destinationFs, destination, sourceFs, source, opts) {
  const normalizedDestination = destinationFs.pathUtils.normalize(destination);
  const normalizedSource = sourceFs.pathUtils.normalize(source);
  const operations = [];
  const lutimes = [];
  await destinationFs.mkdirpPromise(destination);
  await copyImpl(operations, lutimes, destinationFs, normalizedDestination, sourceFs, normalizedSource, opts);

  for (const operation of operations) await operation();

  const updateTime = typeof destinationFs.lutimesPromise === `function` ? destinationFs.lutimesPromise.bind(destinationFs) : destinationFs.utimesPromise.bind(destinationFs);

  for (const [p, atime, mtime] of lutimes) {
    await updateTime(p, atime, mtime);
  }
}

async function copyImpl(operations, lutimes, destinationFs, destination, sourceFs, source, opts) {
  const destinationStat = await maybeLStat(destinationFs, destination);
  const sourceStat = await sourceFs.lstatPromise(source);
  if (opts.stableTime) lutimes.push([destination, defaultTime, defaultTime]);else lutimes.push([destination, sourceStat.atime, sourceStat.mtime]);

  switch (true) {
    case sourceStat.isDirectory():
      {
        await copyFolder(operations, lutimes, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts);
      }
      break;

    case sourceStat.isFile():
      {
        await copyFile(operations, lutimes, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts);
      }
      break;

    case sourceStat.isSymbolicLink():
      {
        await copySymlink(operations, lutimes, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts);
      }
      break;

    default:
      {
        throw new Error(`Unsupported file type (${sourceStat.mode})`);
      }
      break;
  }

  operations.push(async () => destinationFs.chmodPromise(destination, sourceStat.mode & 0o777));
}

async function maybeLStat(baseFs, p) {
  try {
    return await baseFs.lstatPromise(p);
  } catch (e) {
    return null;
  }
}

async function copyFolder(operations, lutimes, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts) {
  if (destinationStat !== null && !destinationStat.isDirectory()) {
    if (opts.overwrite) {
      operations.push(async () => destinationFs.removePromise(destination));
      destinationStat = null;
    } else {
      return;
    }
  }

  if (destinationStat === null) operations.push(async () => destinationFs.mkdirPromise(destination, {
    mode: sourceStat.mode
  }));
  const entries = await sourceFs.readdirPromise(source);

  if (opts.stableSort) {
    for (const entry of entries.sort()) {
      await copyImpl(operations, lutimes, destinationFs, destinationFs.pathUtils.join(destination, entry), sourceFs, sourceFs.pathUtils.join(source, entry), opts);
    }
  } else {
    await Promise.all(entries.map(async entry => {
      await copyImpl(operations, lutimes, destinationFs, destinationFs.pathUtils.join(destination, entry), sourceFs, sourceFs.pathUtils.join(source, entry), opts);
    }));
  }
}

async function copyFile(operations, lutimes, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts) {
  if (destinationStat !== null) {
    if (opts.overwrite) {
      operations.push(async () => destinationFs.removePromise(destination));
      destinationStat = null;
    } else {
      return;
    }
  }

  if (destinationFs === sourceFs) {
    operations.push(async () => destinationFs.copyFilePromise(source, destination, (external_fs_default()).constants.COPYFILE_FICLONE));
  } else {
    operations.push(async () => destinationFs.writeFilePromise(destination, await sourceFs.readFilePromise(source)));
  }
}

async function copySymlink(operations, lutimes, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts) {
  if (destinationStat !== null) {
    if (opts.overwrite) {
      operations.push(async () => destinationFs.removePromise(destination));
      destinationStat = null;
    } else {
      return;
    }
  }

  const target = await sourceFs.readlinkPromise(source);
  operations.push(async () => destinationFs.symlinkPromise((0,path/* convertPath */.CI)(destinationFs.pathUtils, target), destination));
}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/FakeFS.ts



class FakeFS {
  constructor(pathUtils) {
    this.pathUtils = pathUtils;
  }

  async removePromise(p) {
    let stat;

    try {
      stat = await this.lstatPromise(p);
    } catch (error) {
      if (error.code === `ENOENT`) {
        return;
      } else {
        throw error;
      }
    }

    if (stat.isDirectory()) {
      for (const entry of await this.readdirPromise(p)) await this.removePromise(this.pathUtils.resolve(p, entry)); // 5 gives 1s worth of retries at worst


      for (let t = 0; t < 5; ++t) {
        try {
          await this.rmdirPromise(p);
          break;
        } catch (error) {
          if (error.code === `EBUSY` || error.code === `ENOTEMPTY`) {
            await new Promise(resolve => setTimeout(resolve, t * 100));
            continue;
          } else {
            throw error;
          }
        }
      }
    } else {
      await this.unlinkPromise(p);
    }
  }

  removeSync(p) {
    let stat;

    try {
      stat = this.lstatSync(p);
    } catch (error) {
      if (error.code === `ENOENT`) {
        return;
      } else {
        throw error;
      }
    }

    if (stat.isDirectory()) {
      for (const entry of this.readdirSync(p)) this.removeSync(this.pathUtils.resolve(p, entry));

      this.rmdirSync(p);
    } else {
      this.unlinkSync(p);
    }
  }

  async mkdirpPromise(p, {
    chmod,
    utimes
  } = {}) {
    p = this.resolve(p);
    if (p === this.pathUtils.dirname(p)) return;
    const parts = p.split(this.pathUtils.sep);

    for (let u = 2; u <= parts.length; ++u) {
      const subPath = parts.slice(0, u).join(this.pathUtils.sep);

      if (!this.existsSync(subPath)) {
        try {
          await this.mkdirPromise(subPath);
        } catch (error) {
          if (error.code === `EEXIST`) {
            continue;
          } else {
            throw error;
          }
        }

        if (chmod != null) await this.chmodPromise(subPath, chmod);

        if (utimes != null) {
          await this.utimesPromise(subPath, utimes[0], utimes[1]);
        } else {
          const parentStat = await this.statPromise(this.pathUtils.dirname(subPath));
          await this.utimesPromise(subPath, parentStat.atime, parentStat.mtime);
        }
      }
    }
  }

  mkdirpSync(p, {
    chmod,
    utimes
  } = {}) {
    p = this.resolve(p);
    if (p === this.pathUtils.dirname(p)) return;
    const parts = p.split(this.pathUtils.sep);

    for (let u = 2; u <= parts.length; ++u) {
      const subPath = parts.slice(0, u).join(this.pathUtils.sep);

      if (!this.existsSync(subPath)) {
        try {
          this.mkdirSync(subPath);
        } catch (error) {
          if (error.code === `EEXIST`) {
            continue;
          } else {
            throw error;
          }
        }

        if (chmod != null) this.chmodSync(subPath, chmod);

        if (utimes != null) {
          this.utimesSync(subPath, utimes[0], utimes[1]);
        } else {
          const parentStat = this.statSync(this.pathUtils.dirname(subPath));
          this.utimesSync(subPath, parentStat.atime, parentStat.mtime);
        }
      }
    }
  }

  async copyPromise(destination, source, {
    baseFs = this,
    overwrite = true,
    stableSort = false,
    stableTime = false
  } = {}) {
    return await copyPromise(this, destination, baseFs, source, {
      overwrite,
      stableSort,
      stableTime
    });
  }

  copySync(destination, source, {
    baseFs = this,
    overwrite = true
  } = {}) {
    const stat = baseFs.lstatSync(source);
    const exists = this.existsSync(destination);

    if (stat.isDirectory()) {
      this.mkdirpSync(destination);
      const directoryListing = baseFs.readdirSync(source);

      for (const entry of directoryListing) {
        this.copySync(this.pathUtils.join(destination, entry), baseFs.pathUtils.join(source, entry), {
          baseFs,
          overwrite
        });
      }
    } else if (stat.isFile()) {
      if (!exists || overwrite) {
        if (exists) this.removeSync(destination);
        const content = baseFs.readFileSync(source);
        this.writeFileSync(destination, content);
      }
    } else if (stat.isSymbolicLink()) {
      if (!exists || overwrite) {
        if (exists) this.removeSync(destination);
        const target = baseFs.readlinkSync(source);
        this.symlinkSync((0,path/* convertPath */.CI)(this.pathUtils, target), destination);
      }
    } else {
      throw new Error(`Unsupported file type (file: ${source}, mode: 0o${stat.mode.toString(8).padStart(6, `0`)})`);
    }

    const mode = stat.mode & 0o777;
    this.chmodSync(destination, mode);
  }

  async changeFilePromise(p, content, {
    automaticNewlines
  } = {}) {
    let current = ``;

    try {
      current = await this.readFilePromise(p, `utf8`);
    } catch (error) {// ignore errors, no big deal
    }

    const normalizedContent = automaticNewlines ? normalizeLineEndings(current, content) : content;
    if (current === normalizedContent) return;
    await this.writeFilePromise(p, normalizedContent);
  }

  changeFileSync(p, content, {
    automaticNewlines = false
  } = {}) {
    let current = ``;

    try {
      current = this.readFileSync(p, `utf8`);
    } catch (error) {// ignore errors, no big deal
    }

    const normalizedContent = automaticNewlines ? normalizeLineEndings(current, content) : content;
    if (current === normalizedContent) return;
    this.writeFileSync(p, normalizedContent);
  }

  async movePromise(fromP, toP) {
    try {
      await this.renamePromise(fromP, toP);
    } catch (error) {
      if (error.code === `EXDEV`) {
        await this.copyPromise(toP, fromP);
        await this.removePromise(fromP);
      } else {
        throw error;
      }
    }
  }

  moveSync(fromP, toP) {
    try {
      this.renameSync(fromP, toP);
    } catch (error) {
      if (error.code === `EXDEV`) {
        this.copySync(toP, fromP);
        this.removeSync(fromP);
      } else {
        throw error;
      }
    }
  }

  async lockPromise(affectedPath, callback) {
    const lockPath = `${affectedPath}.flock`;
    const interval = 1000 / 60;
    const startTime = Date.now();
    let fd = null; // Even when we detect that a lock file exists, we still look inside to see
    // whether the pid that created it is still alive. It's not foolproof
    // (there are false positive), but there are no false negative and that's
    // all that matters in 99% of the cases.

    const isAlive = async () => {
      let pid;

      try {
        [pid] = await this.readJsonPromise(lockPath);
      } catch (error) {
        // If we can't read the file repeatedly, we assume the process was
        // aborted before even writing finishing writing the payload.
        return Date.now() - startTime < 500;
      }

      try {
        // "As a special case, a signal of 0 can be used to test for the
        // existence of a process" - so we check whether it's alive.
        process.kill(pid, 0);
        return true;
      } catch (error) {
        return false;
      }
    };

    while (fd === null) {
      try {
        fd = await this.openPromise(lockPath, `wx`);
      } catch (error) {
        if (error.code === `EEXIST`) {
          if (!(await isAlive())) {
            try {
              await this.unlinkPromise(lockPath);
              continue;
            } catch (error) {// No big deal if we can't remove it. Just fallback to wait for
              // it to be eventually released by its owner.
            }
          }

          if (Date.now() - startTime < 60 * 1000) {
            await new Promise(resolve => setTimeout(resolve, interval));
          } else {
            throw new Error(`Couldn't acquire a lock in a reasonable time (via ${lockPath})`);
          }
        } else {
          throw error;
        }
      }
    }

    await this.writePromise(fd, JSON.stringify([process.pid]));

    try {
      return await callback();
    } finally {
      try {
        await this.unlinkPromise(lockPath);
        await this.closePromise(fd);
      } catch (error) {// noop
      }
    }
  }

  async readJsonPromise(p) {
    const content = await this.readFilePromise(p, `utf8`);

    try {
      return JSON.parse(content);
    } catch (error) {
      error.message += ` (in ${p})`;
      throw error;
    }
  }

  async readJsonSync(p) {
    const content = this.readFileSync(p, `utf8`);

    try {
      return JSON.parse(content);
    } catch (error) {
      error.message += ` (in ${p})`;
      throw error;
    }
  }

  async writeJsonPromise(p, data) {
    return await this.writeFilePromise(p, `${JSON.stringify(data, null, 2)}\n`);
  }

  writeJsonSync(p, data) {
    return this.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`);
  }

  async preserveTimePromise(p, cb) {
    const stat = await this.lstatPromise(p);
    const result = await cb();
    if (typeof result !== `undefined`) p = result;

    if (this.lutimesPromise) {
      await this.lutimesPromise(p, stat.atime, stat.mtime);
    } else if (!stat.isSymbolicLink()) {
      await this.utimesPromise(p, stat.atime, stat.mtime);
    }
  }

  async preserveTimeSync(p, cb) {
    const stat = this.lstatSync(p);
    const result = cb();
    if (typeof result !== `undefined`) p = result;

    if (this.lutimesSync) {
      this.lutimesSync(p, stat.atime, stat.mtime);
    } else if (!stat.isSymbolicLink()) {
      this.utimesSync(p, stat.atime, stat.mtime);
    }
  }

}
FakeFS.DEFAULT_TIME = 315532800;
class BasePortableFakeFS extends FakeFS {
  constructor() {
    super(path/* ppath */.y1);
  }

}

function getEndOfLine(content) {
  const matches = content.match(/\r?\n/g);
  if (matches === null) return external_os_.EOL;
  const crlf = matches.filter(nl => nl === `\r\n`).length;
  const lf = matches.length - crlf;
  return crlf > lf ? `\r\n` : `\n`;
}

function normalizeLineEndings(originalContent, newContent) {
  return newContent.replace(/\r?\n/g, getEndOfLine(originalContent));
}

/***/ }),

/***/ 9:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LZ": () => /* binding */ PortablePath,
/* harmony export */   "cS": () => /* binding */ npath,
/* harmony export */   "y1": () => /* binding */ ppath,
/* harmony export */   "CI": () => /* binding */ convertPath
/* harmony export */ });
/* unused harmony exports Filename, toFilename */
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(622);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);

var PathType;

(function (PathType) {
  PathType[PathType["File"] = 0] = "File";
  PathType[PathType["Portable"] = 1] = "Portable";
  PathType[PathType["Native"] = 2] = "Native";
})(PathType || (PathType = {}));

const PortablePath = {
  root: `/`,
  dot: `.`
};
const Filename = {
  nodeModules: `node_modules`,
  manifest: `package.json`,
  lockfile: `yarn.lock`,
  rc: `.yarnrc.yml`
};
const npath = Object.create((path__WEBPACK_IMPORTED_MODULE_0___default()));
const ppath = Object.create((path__WEBPACK_IMPORTED_MODULE_0___default().posix));

npath.cwd = () => process.cwd();

ppath.cwd = () => toPortablePath(process.cwd());

ppath.resolve = (...segments) => path__WEBPACK_IMPORTED_MODULE_0___default().posix.resolve(ppath.cwd(), ...segments);

const contains = function (pathUtils, from, to) {
  from = pathUtils.normalize(from);
  to = pathUtils.normalize(to);
  if (from === to) return `.`;
  if (!from.endsWith(pathUtils.sep)) from = from + pathUtils.sep;

  if (to.startsWith(from)) {
    return to.slice(from.length);
  } else {
    return null;
  }
};

npath.fromPortablePath = fromPortablePath;
npath.toPortablePath = toPortablePath;

npath.contains = (from, to) => contains(npath, from, to);

ppath.contains = (from, to) => contains(ppath, from, to);

const WINDOWS_PATH_REGEXP = /^([a-zA-Z]:.*)$/;
const UNC_WINDOWS_PATH_REGEXP = /^\\\\(\.\\)?(.*)$/;
const PORTABLE_PATH_REGEXP = /^\/([a-zA-Z]:.*)$/;
const UNC_PORTABLE_PATH_REGEXP = /^\/unc\/(\.dot\/)?(.*)$/; // Path should look like "/N:/berry/scripts/plugin-pack.js"
// And transform to "N:\berry\scripts\plugin-pack.js"

function fromPortablePath(p) {
  if (process.platform !== `win32`) return p;
  if (p.match(PORTABLE_PATH_REGEXP)) p = p.replace(PORTABLE_PATH_REGEXP, `$1`);else if (p.match(UNC_PORTABLE_PATH_REGEXP)) p = p.replace(UNC_PORTABLE_PATH_REGEXP, (match, p1, p2) => `\\\\${p1 ? `.\\` : ``}${p2}`);else return p;
  return p.replace(/\//g, `\\`);
} // Path should look like "N:/berry/scripts/plugin-pack.js"
// And transform to "/N:/berry/scripts/plugin-pack.js"


function toPortablePath(p) {
  if (process.platform !== `win32`) return p;
  if (p.match(WINDOWS_PATH_REGEXP)) p = p.replace(WINDOWS_PATH_REGEXP, `/$1`);else if (p.match(UNC_WINDOWS_PATH_REGEXP)) p = p.replace(UNC_WINDOWS_PATH_REGEXP, (match, p1, p2) => `/unc/${p1 ? `.dot/` : ``}${p2}`);
  return p.replace(/\\/g, `/`);
}

function convertPath(targetPathUtils, sourcePath) {
  return targetPathUtils === npath ? fromPortablePath(sourcePath) : toPortablePath(sourcePath);
}
function toFilename(filename) {
  if (npath.parse(filename).dir !== `` || ppath.parse(filename).dir !== ``) throw new Error(`Invalid filename: "${filename}"`);
  return filename;
}

/***/ }),

/***/ 936:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => /* default */ _entryPoint
});

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(747);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);

// EXTERNAL MODULE: ../yarnpkg-fslib/sources/FakeFS.ts + 1 modules
var FakeFS = __webpack_require__(398);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/errors.ts
function makeError(code, message) {
  return Object.assign(new Error(`${code}: ${message}`), {
    code
  });
}

function EBUSY(message) {
  return makeError(`EBUSY`, message);
}
function ENOSYS(message, reason) {
  return makeError(`ENOSYS`, `${message}, ${reason}`);
}
function EINVAL(reason) {
  return makeError(`EINVAL`, `invalid argument, ${reason}`);
}
function EBADF(reason) {
  return makeError(`EBADF`, `bad file descriptor, ${reason}`);
}
function ENOENT(reason) {
  return makeError(`ENOENT`, `no such file or directory, ${reason}`);
}
function ENOTDIR(reason) {
  return makeError(`ENOTDIR`, `not a directory, ${reason}`);
}
function EISDIR(reason) {
  return makeError(`EISDIR`, `illegal operation on a directory, ${reason}`);
}
function EEXIST(reason) {
  return makeError(`EEXIST`, `file already exists, ${reason}`);
}
function EROFS(reason) {
  return makeError(`EROFS`, `read-only filesystem, ${reason}`);
}
// EXTERNAL MODULE: ../yarnpkg-fslib/sources/path.ts
var sources_path = __webpack_require__(9);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/NodeFS.ts




class NodeFS extends FakeFS/* BasePortableFakeFS */.fS {
  constructor(realFs = (external_fs_default())) {
    super();
    this.realFs = realFs; // @ts-ignore

    if (typeof this.realFs.lutimes !== `undefined`) {
      this.lutimesPromise = this.lutimesPromiseImpl;
      this.lutimesSync = this.lutimesSyncImpl;
    }
  }

  getExtractHint() {
    return false;
  }

  getRealPath() {
    return sources_path/* PortablePath.root */.LZ.root;
  }

  resolve(p) {
    return sources_path/* ppath.resolve */.y1.resolve(p);
  }

  async openPromise(p, flags, mode) {
    return await new Promise((resolve, reject) => {
      this.realFs.open(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), flags, mode, this.makeCallback(resolve, reject));
    });
  }

  openSync(p, flags, mode) {
    return this.realFs.openSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), flags, mode);
  }

  async readPromise(fd, buffer, offset = 0, length = 0, position = -1) {
    return await new Promise((resolve, reject) => {
      this.realFs.read(fd, buffer, offset, length, position, (error, bytesRead) => {
        if (error) {
          reject(error);
        } else {
          resolve(bytesRead);
        }
      });
    });
  }

  readSync(fd, buffer, offset, length, position) {
    return this.realFs.readSync(fd, buffer, offset, length, position);
  }

  async writePromise(fd, buffer, offset, length, position) {
    return await new Promise((resolve, reject) => {
      if (typeof buffer === `string`) {
        return this.realFs.write(fd, buffer, offset, this.makeCallback(resolve, reject));
      } else {
        return this.realFs.write(fd, buffer, offset, length, position, this.makeCallback(resolve, reject));
      }
    });
  }

  writeSync(fd, buffer, offset, length, position) {
    if (typeof buffer === `string`) {
      return this.realFs.writeSync(fd, buffer, offset);
    } else {
      return this.realFs.writeSync(fd, buffer, offset, length, position);
    }
  }

  async closePromise(fd) {
    await new Promise((resolve, reject) => {
      this.realFs.close(fd, this.makeCallback(resolve, reject));
    });
  }

  closeSync(fd) {
    this.realFs.closeSync(fd);
  }

  createReadStream(p, opts) {
    const realPath = p !== null ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;
    return this.realFs.createReadStream(realPath, opts);
  }

  createWriteStream(p, opts) {
    const realPath = p !== null ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;
    return this.realFs.createWriteStream(realPath, opts);
  }

  async realpathPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.realpath(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), {}, this.makeCallback(resolve, reject));
    }).then(path => {
      return sources_path/* npath.toPortablePath */.cS.toPortablePath(path);
    });
  }

  realpathSync(p) {
    return sources_path/* npath.toPortablePath */.cS.toPortablePath(this.realFs.realpathSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), {}));
  }

  async existsPromise(p) {
    return await new Promise(resolve => {
      this.realFs.exists(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), resolve);
    });
  }

  accessSync(p, mode) {
    return this.realFs.accessSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), mode);
  }

  async accessPromise(p, mode) {
    return await new Promise((resolve, reject) => {
      this.realFs.access(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), mode, this.makeCallback(resolve, reject));
    });
  }

  existsSync(p) {
    return this.realFs.existsSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async statPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.stat(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    });
  }

  statSync(p) {
    return this.realFs.statSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async lstatPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.lstat(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    });
  }

  lstatSync(p) {
    return this.realFs.lstatSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async chmodPromise(p, mask) {
    return await new Promise((resolve, reject) => {
      this.realFs.chmod(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), mask, this.makeCallback(resolve, reject));
    });
  }

  chmodSync(p, mask) {
    return this.realFs.chmodSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), mask);
  }

  async renamePromise(oldP, newP) {
    return await new Promise((resolve, reject) => {
      this.realFs.rename(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(oldP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(newP), this.makeCallback(resolve, reject));
    });
  }

  renameSync(oldP, newP) {
    return this.realFs.renameSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(oldP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(newP));
  }

  async copyFilePromise(sourceP, destP, flags = 0) {
    return await new Promise((resolve, reject) => {
      this.realFs.copyFile(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(sourceP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(destP), flags, this.makeCallback(resolve, reject));
    });
  }

  copyFileSync(sourceP, destP, flags = 0) {
    return this.realFs.copyFileSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(sourceP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(destP), flags);
  }

  async appendFilePromise(p, content, opts) {
    return await new Promise((resolve, reject) => {
      const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;

      if (opts) {
        this.realFs.appendFile(fsNativePath, content, opts, this.makeCallback(resolve, reject));
      } else {
        this.realFs.appendFile(fsNativePath, content, this.makeCallback(resolve, reject));
      }
    });
  }

  appendFileSync(p, content, opts) {
    const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;

    if (opts) {
      this.realFs.appendFileSync(fsNativePath, content, opts);
    } else {
      this.realFs.appendFileSync(fsNativePath, content);
    }
  }

  async writeFilePromise(p, content, opts) {
    return await new Promise((resolve, reject) => {
      const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;

      if (opts) {
        this.realFs.writeFile(fsNativePath, content, opts, this.makeCallback(resolve, reject));
      } else {
        this.realFs.writeFile(fsNativePath, content, this.makeCallback(resolve, reject));
      }
    });
  }

  writeFileSync(p, content, opts) {
    const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;

    if (opts) {
      this.realFs.writeFileSync(fsNativePath, content, opts);
    } else {
      this.realFs.writeFileSync(fsNativePath, content);
    }
  }

  async unlinkPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.unlink(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    });
  }

  unlinkSync(p) {
    return this.realFs.unlinkSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async utimesPromise(p, atime, mtime) {
    return await new Promise((resolve, reject) => {
      this.realFs.utimes(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), atime, mtime, this.makeCallback(resolve, reject));
    });
  }

  utimesSync(p, atime, mtime) {
    this.realFs.utimesSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), atime, mtime);
  }

  async lutimesPromiseImpl(p, atime, mtime) {
    // @ts-ignore: Not yet in DefinitelyTyped
    const lutimes = this.realFs.lutimes;
    if (typeof lutimes === `undefined`) throw ENOSYS(`unavailable Node binding`, `lutimes '${p}'`);
    return await new Promise((resolve, reject) => {
      lutimes.call(this.realFs, sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), atime, mtime, this.makeCallback(resolve, reject));
    });
  }

  lutimesSyncImpl(p, atime, mtime) {
    // @ts-ignore: Not yet in DefinitelyTyped
    const lutimesSync = this.realFs.lutimesSync;
    if (typeof lutimesSync === `undefined`) throw ENOSYS(`unavailable Node binding`, `lutimes '${p}'`);
    lutimesSync.call(this.realFs, sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), atime, mtime);
  }

  async mkdirPromise(p, opts) {
    return await new Promise((resolve, reject) => {
      this.realFs.mkdir(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), opts, this.makeCallback(resolve, reject));
    });
  }

  mkdirSync(p, opts) {
    return this.realFs.mkdirSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), opts);
  }

  async rmdirPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.rmdir(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    });
  }

  rmdirSync(p) {
    return this.realFs.rmdirSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async symlinkPromise(target, p, type) {
    const symlinkType = type || (target.endsWith(`/`) ? `dir` : `file`);
    return await new Promise((resolve, reject) => {
      this.realFs.symlink(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(target.replace(/\/+$/, ``)), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), symlinkType, this.makeCallback(resolve, reject));
    });
  }

  symlinkSync(target, p, type) {
    const symlinkType = type || (target.endsWith(`/`) ? `dir` : `file`);
    return this.realFs.symlinkSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(target.replace(/\/+$/, ``)), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), symlinkType);
  }

  async readFilePromise(p, encoding) {
    return await new Promise((resolve, reject) => {
      const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;
      this.realFs.readFile(fsNativePath, encoding, this.makeCallback(resolve, reject));
    });
  }

  readFileSync(p, encoding) {
    const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;
    return this.realFs.readFileSync(fsNativePath, encoding);
  }

  async readdirPromise(p, {
    withFileTypes
  } = {}) {
    return await new Promise((resolve, reject) => {
      if (withFileTypes) {
        this.realFs.readdir(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), {
          withFileTypes: true
        }, this.makeCallback(resolve, reject));
      } else {
        this.realFs.readdir(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(value => resolve(value), reject));
      }
    });
  }

  readdirSync(p, {
    withFileTypes
  } = {}) {
    if (withFileTypes) {
      return this.realFs.readdirSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), {
        withFileTypes: true
      });
    } else {
      return this.realFs.readdirSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
    }
  }

  async readlinkPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.readlink(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    }).then(path => {
      return sources_path/* npath.toPortablePath */.cS.toPortablePath(path);
    });
  }

  readlinkSync(p) {
    return sources_path/* npath.toPortablePath */.cS.toPortablePath(this.realFs.readlinkSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p)));
  }

  watch(p, a, b) {
    return this.realFs.watch(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), // @ts-ignore
    a, b);
  }

  makeCallback(resolve, reject) {
    return (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
  }

}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/ProxiedFS.ts

class ProxiedFS extends FakeFS/* FakeFS */.uY {
  getExtractHint(hints) {
    return this.baseFs.getExtractHint(hints);
  }

  resolve(path) {
    return this.mapFromBase(this.baseFs.resolve(this.mapToBase(path)));
  }

  getRealPath() {
    return this.mapFromBase(this.baseFs.getRealPath());
  }

  openPromise(p, flags, mode) {
    return this.baseFs.openPromise(this.mapToBase(p), flags, mode);
  }

  openSync(p, flags, mode) {
    return this.baseFs.openSync(this.mapToBase(p), flags, mode);
  }

  async readPromise(fd, buffer, offset, length, position) {
    return await this.baseFs.readPromise(fd, buffer, offset, length, position);
  }

  readSync(fd, buffer, offset, length, position) {
    return this.baseFs.readSync(fd, buffer, offset, length, position);
  }

  async writePromise(fd, buffer, offset, length, position) {
    if (typeof buffer === `string`) {
      return await this.baseFs.writePromise(fd, buffer, offset);
    } else {
      return await this.baseFs.writePromise(fd, buffer, offset, length, position);
    }
  }

  writeSync(fd, buffer, offset, length, position) {
    if (typeof buffer === `string`) {
      return this.baseFs.writeSync(fd, buffer, offset);
    } else {
      return this.baseFs.writeSync(fd, buffer, offset, length, position);
    }
  }

  closePromise(fd) {
    return this.baseFs.closePromise(fd);
  }

  closeSync(fd) {
    this.baseFs.closeSync(fd);
  }

  createReadStream(p, opts) {
    return this.baseFs.createReadStream(p !== null ? this.mapToBase(p) : p, opts);
  }

  createWriteStream(p, opts) {
    return this.baseFs.createWriteStream(p !== null ? this.mapToBase(p) : p, opts);
  }

  async realpathPromise(p) {
    return this.mapFromBase(await this.baseFs.realpathPromise(this.mapToBase(p)));
  }

  realpathSync(p) {
    return this.mapFromBase(this.baseFs.realpathSync(this.mapToBase(p)));
  }

  existsPromise(p) {
    return this.baseFs.existsPromise(this.mapToBase(p));
  }

  existsSync(p) {
    return this.baseFs.existsSync(this.mapToBase(p));
  }

  accessSync(p, mode) {
    return this.baseFs.accessSync(this.mapToBase(p), mode);
  }

  accessPromise(p, mode) {
    return this.baseFs.accessPromise(this.mapToBase(p), mode);
  }

  statPromise(p) {
    return this.baseFs.statPromise(this.mapToBase(p));
  }

  statSync(p) {
    return this.baseFs.statSync(this.mapToBase(p));
  }

  lstatPromise(p) {
    return this.baseFs.lstatPromise(this.mapToBase(p));
  }

  lstatSync(p) {
    return this.baseFs.lstatSync(this.mapToBase(p));
  }

  chmodPromise(p, mask) {
    return this.baseFs.chmodPromise(this.mapToBase(p), mask);
  }

  chmodSync(p, mask) {
    return this.baseFs.chmodSync(this.mapToBase(p), mask);
  }

  renamePromise(oldP, newP) {
    return this.baseFs.renamePromise(this.mapToBase(oldP), this.mapToBase(newP));
  }

  renameSync(oldP, newP) {
    return this.baseFs.renameSync(this.mapToBase(oldP), this.mapToBase(newP));
  }

  copyFilePromise(sourceP, destP, flags = 0) {
    return this.baseFs.copyFilePromise(this.mapToBase(sourceP), this.mapToBase(destP), flags);
  }

  copyFileSync(sourceP, destP, flags = 0) {
    return this.baseFs.copyFileSync(this.mapToBase(sourceP), this.mapToBase(destP), flags);
  }

  appendFilePromise(p, content, opts) {
    return this.baseFs.appendFilePromise(this.fsMapToBase(p), content, opts);
  }

  appendFileSync(p, content, opts) {
    return this.baseFs.appendFileSync(this.fsMapToBase(p), content, opts);
  }

  writeFilePromise(p, content, opts) {
    return this.baseFs.writeFilePromise(this.fsMapToBase(p), content, opts);
  }

  writeFileSync(p, content, opts) {
    return this.baseFs.writeFileSync(this.fsMapToBase(p), content, opts);
  }

  unlinkPromise(p) {
    return this.baseFs.unlinkPromise(this.mapToBase(p));
  }

  unlinkSync(p) {
    return this.baseFs.unlinkSync(this.mapToBase(p));
  }

  utimesPromise(p, atime, mtime) {
    return this.baseFs.utimesPromise(this.mapToBase(p), atime, mtime);
  }

  utimesSync(p, atime, mtime) {
    return this.baseFs.utimesSync(this.mapToBase(p), atime, mtime);
  }

  mkdirPromise(p, opts) {
    return this.baseFs.mkdirPromise(this.mapToBase(p), opts);
  }

  mkdirSync(p, opts) {
    return this.baseFs.mkdirSync(this.mapToBase(p), opts);
  }

  rmdirPromise(p) {
    return this.baseFs.rmdirPromise(this.mapToBase(p));
  }

  rmdirSync(p) {
    return this.baseFs.rmdirSync(this.mapToBase(p));
  }

  symlinkPromise(target, p, type) {
    return this.baseFs.symlinkPromise(this.mapToBase(target), this.mapToBase(p), type);
  }

  symlinkSync(target, p, type) {
    return this.baseFs.symlinkSync(this.mapToBase(target), this.mapToBase(p), type);
  }

  readFilePromise(p, encoding) {
    // This weird condition is required to tell TypeScript that the signatures are proper (otherwise it thinks that only the generic one is covered)
    if (encoding === `utf8`) {
      return this.baseFs.readFilePromise(this.fsMapToBase(p), encoding);
    } else {
      return this.baseFs.readFilePromise(this.fsMapToBase(p), encoding);
    }
  }

  readFileSync(p, encoding) {
    // This weird condition is required to tell TypeScript that the signatures are proper (otherwise it thinks that only the generic one is covered)
    if (encoding === `utf8`) {
      return this.baseFs.readFileSync(this.fsMapToBase(p), encoding);
    } else {
      return this.baseFs.readFileSync(this.fsMapToBase(p), encoding);
    }
  }

  async readdirPromise(p, {
    withFileTypes
  } = {}) {
    return this.baseFs.readdirPromise(this.mapToBase(p), {
      withFileTypes: withFileTypes
    });
  }

  readdirSync(p, {
    withFileTypes
  } = {}) {
    return this.baseFs.readdirSync(this.mapToBase(p), {
      withFileTypes: withFileTypes
    });
  }

  async readlinkPromise(p) {
    return this.mapFromBase(await this.baseFs.readlinkPromise(this.mapToBase(p)));
  }

  readlinkSync(p) {
    return this.mapFromBase(this.baseFs.readlinkSync(this.mapToBase(p)));
  }

  watch(p, a, b) {
    return this.baseFs.watch(this.mapToBase(p), // @ts-ignore
    a, b);
  }

  fsMapToBase(p) {
    if (typeof p === `number`) {
      return p;
    } else {
      return this.mapToBase(p);
    }
  }

}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/VirtualFS.ts



const NUMBER_REGEXP = /^[0-9]+$/; // $0: full path
// $1: virtual folder
// $2: virtual segment
// $3: hash
// $4: depth
// $5: subpath

const VIRTUAL_REGEXP = /^(\/(?:[^/]+\/)*?\$\$virtual)((?:\/((?:[^/]+-)?[a-f0-9]+)(?:\/([^/]+))?)?((?:\/.*)?))$/;
const VALID_COMPONENT = /^([^/]+-)?[a-f0-9]+$/;
class VirtualFS extends ProxiedFS {
  constructor({
    baseFs = new NodeFS()
  } = {}) {
    super(sources_path/* ppath */.y1);
    this.baseFs = baseFs;
  }

  static makeVirtualPath(base, component, to) {
    if (sources_path/* ppath.basename */.y1.basename(base) !== `$$virtual`) throw new Error(`Assertion failed: Virtual folders must be named "$$virtual"`);
    if (!sources_path/* ppath.basename */.y1.basename(component).match(VALID_COMPONENT)) throw new Error(`Assertion failed: Virtual components must be ended by an hexadecimal hash`); // Obtains the relative distance between the virtual path and its actual target

    const target = sources_path/* ppath.relative */.y1.relative(sources_path/* ppath.dirname */.y1.dirname(base), to);
    const segments = target.split(`/`); // Counts how many levels we need to go back to start applying the rest of the path

    let depth = 0;

    while (depth < segments.length && segments[depth] === `..`) depth += 1;

    const finalSegments = segments.slice(depth);
    const fullVirtualPath = sources_path/* ppath.join */.y1.join(base, component, String(depth), ...finalSegments);
    return fullVirtualPath;
  }

  static resolveVirtual(p) {
    const match = p.match(VIRTUAL_REGEXP);
    if (!match || !match[3] && match[5]) return p;
    const target = sources_path/* ppath.dirname */.y1.dirname(match[1]);
    if (!match[3] || !match[4]) return target;
    const isnum = NUMBER_REGEXP.test(match[4]);
    if (!isnum) return p;
    const depth = Number(match[4]);
    const backstep = `../`.repeat(depth);
    const subpath = match[5] || `.`;
    return VirtualFS.resolveVirtual(sources_path/* ppath.join */.y1.join(target, backstep, subpath));
  }

  getExtractHint(hints) {
    return this.baseFs.getExtractHint(hints);
  }

  getRealPath() {
    return this.baseFs.getRealPath();
  }

  realpathSync(p) {
    const match = p.match(VIRTUAL_REGEXP);
    if (!match) return this.baseFs.realpathSync(p);
    if (!match[5]) return p;
    const realpath = this.baseFs.realpathSync(this.mapToBase(p));
    return VirtualFS.makeVirtualPath(match[1], match[3], realpath);
  }

  async realpathPromise(p) {
    const match = p.match(VIRTUAL_REGEXP);
    if (!match) return await this.baseFs.realpathPromise(p);
    if (!match[5]) return p;
    const realpath = await this.baseFs.realpathPromise(this.mapToBase(p));
    return VirtualFS.makeVirtualPath(match[1], match[3], realpath);
  }

  mapToBase(p) {
    return VirtualFS.resolveVirtual(p);
  }

  mapFromBase(p) {
    return p;
  }

}
// EXTERNAL MODULE: external "stream"
var external_stream_ = __webpack_require__(413);

// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(669);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/ZipFS.ts







const DEFAULT_COMPRESSION_LEVEL = `mixed`;
const S_IFMT = 0o170000;
const S_IFDIR = 0o040000;
const S_IFREG = 0o100000;
const S_IFLNK = 0o120000;

class DirEntry {
  constructor() {
    this.name = ``;
    this.mode = 0;
  }

  isBlockDevice() {
    return false;
  }

  isCharacterDevice() {
    return false;
  }

  isDirectory() {
    return (this.mode & S_IFMT) === S_IFDIR;
  }

  isFIFO() {
    return false;
  }

  isFile() {
    return (this.mode & S_IFMT) === S_IFREG;
  }

  isSocket() {
    return false;
  }

  isSymbolicLink() {
    return (this.mode & S_IFMT) === S_IFLNK;
  }

}

class StatEntry {
  constructor() {
    this.dev = 0;
    this.ino = 0;
    this.mode = 0;
    this.nlink = 1;
    this.rdev = 0;
    this.blocks = 1;
  }

  isBlockDevice() {
    return false;
  }

  isCharacterDevice() {
    return false;
  }

  isDirectory() {
    return (this.mode & S_IFMT) === S_IFDIR;
  }

  isFIFO() {
    return false;
  }

  isFile() {
    return (this.mode & S_IFMT) === S_IFREG;
  }

  isSocket() {
    return false;
  }

  isSymbolicLink() {
    return (this.mode & S_IFMT) === S_IFLNK;
  }

}

function makeDefaultStats() {
  return Object.assign(new StatEntry(), {
    uid: 0,
    gid: 0,
    size: 0,
    blksize: 0,
    atimeMs: 0,
    mtimeMs: 0,
    ctimeMs: 0,
    birthtimeMs: 0,
    atime: new Date(0),
    mtime: new Date(0),
    ctime: new Date(0),
    birthtime: new Date(0),
    mode: S_IFREG | 0o644
  });
}

function toUnixTimestamp(time) {
  if (typeof time === `string` && String(+time) === time) return +time; // @ts-ignore

  if (Number.isFinite(time)) {
    if (time < 0) {
      return Date.now() / 1000;
    } else {
      return time;
    }
  } // convert to 123.456 UNIX timestamp


  if ((0,external_util_.isDate)(time)) return time.getTime() / 1000;
  throw new Error(`Invalid time`);
}

class ZipFS extends FakeFS/* BasePortableFakeFS */.fS {
  constructor(source, opts) {
    super();
    this.lzSource = null;
    this.listings = new Map();
    this.entries = new Map();
    this.fds = new Map();
    this.nextFd = 0;
    this.ready = false;
    this.readOnly = false;
    this.libzip = opts.libzip;
    const pathOptions = opts;
    this.level = typeof pathOptions.level !== `undefined` ? pathOptions.level : DEFAULT_COMPRESSION_LEVEL;

    if (source === null) {
      source = Buffer.from([0x50, 0x4B, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    }

    if (typeof source === `string`) {
      const {
        baseFs = new NodeFS()
      } = pathOptions;
      this.baseFs = baseFs;
      this.path = source;
    } else {
      this.path = null;
      this.baseFs = null;
    }

    if (opts.stats) {
      this.stats = opts.stats;
    } else {
      if (typeof source === `string`) {
        try {
          this.stats = this.baseFs.statSync(source);
        } catch (error) {
          if (error.code === `ENOENT` && pathOptions.create) {
            this.stats = makeDefaultStats();
          } else {
            throw error;
          }
        }
      } else {
        this.stats = makeDefaultStats();
      }
    }

    const errPtr = this.libzip.malloc(4);

    try {
      let flags = 0;
      if (typeof source === `string` && pathOptions.create) flags |= this.libzip.ZIP_CREATE | this.libzip.ZIP_TRUNCATE;

      if (opts.readOnly) {
        flags |= this.libzip.ZIP_RDONLY;
        this.readOnly = true;
      }

      if (typeof source === `string`) {
        this.zip = this.libzip.open(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(source), flags, errPtr);
      } else {
        const lzSource = this.allocateUnattachedSource(source);

        try {
          this.zip = this.libzip.openFromSource(lzSource, flags, errPtr);
          this.lzSource = lzSource;
        } catch (error) {
          this.libzip.source.free(lzSource);
          throw error;
        }
      }

      if (this.zip === 0) {
        const error = this.libzip.struct.errorS();
        this.libzip.error.initWithCode(error, this.libzip.getValue(errPtr, `i32`));
        throw new Error(this.libzip.error.strerror(error));
      }
    } finally {
      this.libzip.free(errPtr);
    }

    this.listings.set(sources_path/* PortablePath.root */.LZ.root, new Set());
    const entryCount = this.libzip.getNumEntries(this.zip, 0);

    for (let t = 0; t < entryCount; ++t) {
      const raw = this.libzip.getName(this.zip, t, 0);
      if (sources_path/* ppath.isAbsolute */.y1.isAbsolute(raw)) continue;
      const p = sources_path/* ppath.resolve */.y1.resolve(sources_path/* PortablePath.root */.LZ.root, raw);
      this.registerEntry(p, t); // If the raw path is a directory, register it
      // to prevent empty folder being skipped

      if (raw.endsWith(`/`)) {
        this.registerListing(p);
      }
    }

    this.symlinkCount = this.libzip.ext.countSymlinks(this.zip);
    this.ready = true;
  }

  getExtractHint(hints) {
    for (const fileName of this.entries.keys()) {
      const ext = this.pathUtils.extname(fileName);

      if (hints.relevantExtensions.has(ext)) {
        return true;
      }
    }

    return false;
  }

  getAllFiles() {
    return Array.from(this.entries.keys());
  }

  getRealPath() {
    if (!this.path) throw new Error(`ZipFS don't have real paths when loaded from a buffer`);
    return this.path;
  }

  getBufferAndClose() {
    if (!this.ready) throw EBUSY(`archive closed, close`);
    if (!this.lzSource) throw new Error(`ZipFS was not created from a Buffer`);

    try {
      // Prevent close from cleaning up the source
      this.libzip.source.keep(this.lzSource); // Close the zip archive

      if (this.libzip.close(this.zip) === -1) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip))); // Open the source for reading

      if (this.libzip.source.open(this.lzSource) === -1) throw new Error(this.libzip.error.strerror(this.libzip.source.error(this.lzSource))); // Move to the end of source

      if (this.libzip.source.seek(this.lzSource, 0, 0, this.libzip.SEEK_END) === -1) throw new Error(this.libzip.error.strerror(this.libzip.source.error(this.lzSource))); // Get the size of source

      const size = this.libzip.source.tell(this.lzSource); // Move to the start of source

      if (this.libzip.source.seek(this.lzSource, 0, 0, this.libzip.SEEK_SET) === -1) throw new Error(this.libzip.error.strerror(this.libzip.source.error(this.lzSource)));
      const buffer = this.libzip.malloc(size);
      if (!buffer) throw new Error(`Couldn't allocate enough memory`);

      try {
        const rc = this.libzip.source.read(this.lzSource, buffer, size);
        if (rc === -1) throw new Error(this.libzip.error.strerror(this.libzip.source.error(this.lzSource)));else if (rc < size) throw new Error(`Incomplete read`);else if (rc > size) throw new Error(`Overread`);
        const memory = this.libzip.HEAPU8.subarray(buffer, buffer + size);
        return Buffer.from(memory);
      } finally {
        this.libzip.free(buffer);
      }
    } finally {
      this.libzip.source.close(this.lzSource);
      this.libzip.source.free(this.lzSource);
      this.ready = false;
    }
  }

  saveAndClose() {
    if (!this.path || !this.baseFs) throw new Error(`ZipFS cannot be saved and must be discarded when loaded from a buffer`);
    if (!this.ready) throw EBUSY(`archive closed, close`);

    if (this.readOnly) {
      this.discardAndClose();
      return;
    }

    const previousMod = this.baseFs.existsSync(this.path) ? this.baseFs.statSync(this.path).mode & 0o777 : null;
    const rc = this.libzip.close(this.zip);
    if (rc === -1) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip))); // this.libzip overrides the chmod when writing the archive, which is a weird
    // behavior I don't totally understand (plus the umask seems bogus in some
    // weird cases - maybe related to emscripten?)
    //
    // See also https://github.com/nih-at/libzip/issues/77

    if (previousMod === null) this.baseFs.chmodSync(this.path, this.stats.mode);else if (previousMod !== (this.baseFs.statSync(this.path).mode & 0o777)) this.baseFs.chmodSync(this.path, previousMod);
    this.ready = false;
  }

  discardAndClose() {
    if (!this.ready) throw EBUSY(`archive closed, close`);
    this.libzip.discard(this.zip);
    this.ready = false;
  }

  resolve(p) {
    return sources_path/* ppath.resolve */.y1.resolve(sources_path/* PortablePath.root */.LZ.root, p);
  }

  async openPromise(p, flags, mode) {
    return this.openSync(p, flags, mode);
  }

  openSync(p, flags, mode) {
    const fd = this.nextFd++;
    this.fds.set(fd, {
      cursor: 0,
      p
    });
    return fd;
  }

  async readPromise(fd, buffer, offset, length, position) {
    return this.readSync(fd, buffer, offset, length, position);
  }

  readSync(fd, buffer, offset = 0, length = 0, position = -1) {
    const entry = this.fds.get(fd);
    if (typeof entry === `undefined`) throw EBADF(`read`);
    let realPosition;
    if (position === -1 || position === null) realPosition = entry.cursor;else realPosition = position;
    const source = this.readFileSync(entry.p);
    source.copy(buffer, offset, realPosition, realPosition + length);
    const bytesRead = Math.max(0, Math.min(source.length - realPosition, length));
    if (position === -1 || position === null) entry.cursor += bytesRead;
    return bytesRead;
  }

  async writePromise(fd, buffer, offset, length, position) {
    if (typeof buffer === `string`) {
      return this.writeSync(fd, buffer, position);
    } else {
      return this.writeSync(fd, buffer, offset, length, position);
    }
  }

  writeSync(fd, buffer, offset, length, position) {
    const entry = this.fds.get(fd);
    if (typeof entry === `undefined`) throw EBADF(`read`);
    throw new Error(`Unimplemented`);
  }

  async closePromise(fd) {
    return this.closeSync(fd);
  }

  closeSync(fd) {
    const entry = this.fds.get(fd);
    if (typeof entry === `undefined`) throw EBADF(`read`);
    this.fds.delete(fd);
  }

  createReadStream(p, {
    encoding
  } = {}) {
    if (p === null) throw new Error(`Unimplemented`);
    const stream = Object.assign(new external_stream_.PassThrough(), {
      bytesRead: 0,
      path: p,
      close: () => {
        clearImmediate(immediate);
      }
    });
    const immediate = setImmediate(() => {
      try {
        const data = this.readFileSync(p, encoding);
        stream.bytesRead = data.length;
        stream.write(data);
        stream.end();
      } catch (error) {
        stream.emit(`error`, error);
        stream.end();
      }
    });
    return stream;
  }

  createWriteStream(p, {
    encoding
  } = {}) {
    if (this.readOnly) throw EROFS(`open '${p}'`);
    if (p === null) throw new Error(`Unimplemented`);
    const stream = Object.assign(new external_stream_.PassThrough(), {
      bytesWritten: 0,
      path: p,
      close: () => {
        stream.end();
      }
    });
    const chunks = [];
    stream.on(`data`, chunk => {
      const chunkBuffer = Buffer.from(chunk);
      stream.bytesWritten += chunkBuffer.length;
      chunks.push(chunkBuffer);
    });
    stream.on(`end`, () => {
      this.writeFileSync(p, Buffer.concat(chunks), encoding);
    });
    return stream;
  }

  async realpathPromise(p) {
    return this.realpathSync(p);
  }

  realpathSync(p) {
    const resolvedP = this.resolveFilename(`lstat '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`lstat '${p}'`);
    return resolvedP;
  }

  async existsPromise(p) {
    return this.existsSync(p);
  }

  existsSync(p) {
    if (!this.ready) throw EBUSY(`archive closed, existsSync '${p}'`);

    if (this.symlinkCount === 0) {
      const resolvedP = sources_path/* ppath.resolve */.y1.resolve(sources_path/* PortablePath.root */.LZ.root, p);
      return this.entries.has(resolvedP) || this.listings.has(resolvedP);
    }

    let resolvedP;

    try {
      resolvedP = this.resolveFilename(`stat '${p}'`, p);
    } catch (error) {
      return false;
    }

    return this.entries.has(resolvedP) || this.listings.has(resolvedP);
  }

  async accessPromise(p, mode) {
    return this.accessSync(p, mode);
  }

  accessSync(p, mode = external_fs_.constants.F_OK) {
    const resolvedP = this.resolveFilename(`access '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`access '${p}'`);

    if (this.readOnly && mode & external_fs_.constants.W_OK) {
      throw EROFS(`access '${p}'`);
    }
  }

  async statPromise(p) {
    return this.statSync(p);
  }

  statSync(p) {
    const resolvedP = this.resolveFilename(`stat '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`stat '${p}'`);
    if (p[p.length - 1] === `/` && !this.listings.has(resolvedP)) throw ENOTDIR(`stat '${p}'`);
    return this.statImpl(`stat '${p}'`, resolvedP);
  }

  async lstatPromise(p) {
    return this.lstatSync(p);
  }

  lstatSync(p) {
    const resolvedP = this.resolveFilename(`lstat '${p}'`, p, false);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`lstat '${p}'`);
    if (p[p.length - 1] === `/` && !this.listings.has(resolvedP)) throw ENOTDIR(`lstat '${p}'`);
    return this.statImpl(`lstat '${p}'`, resolvedP);
  }

  statImpl(reason, p) {
    const entry = this.entries.get(p); // File, or explicit directory

    if (typeof entry !== `undefined`) {
      const stat = this.libzip.struct.statS();
      const rc = this.libzip.statIndex(this.zip, entry, 0, 0, stat);
      if (rc === -1) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
      const uid = this.stats.uid;
      const gid = this.stats.gid;
      const size = this.libzip.struct.statSize(stat) >>> 0;
      const blksize = 512;
      const blocks = Math.ceil(size / blksize);
      const mtimeMs = (this.libzip.struct.statMtime(stat) >>> 0) * 1000;
      const atimeMs = mtimeMs;
      const birthtimeMs = mtimeMs;
      const ctimeMs = mtimeMs;
      const atime = new Date(atimeMs);
      const birthtime = new Date(birthtimeMs);
      const ctime = new Date(ctimeMs);
      const mtime = new Date(mtimeMs);
      const type = this.listings.has(p) ? S_IFDIR : this.isSymbolicLink(entry) ? S_IFLNK : S_IFREG;
      const defaultMode = type === S_IFDIR ? 0o755 : 0o644;
      const mode = type | this.getUnixMode(entry, defaultMode) & 0o777;
      return Object.assign(new StatEntry(), {
        uid,
        gid,
        size,
        blksize,
        blocks,
        atime,
        birthtime,
        ctime,
        mtime,
        atimeMs,
        birthtimeMs,
        ctimeMs,
        mtimeMs,
        mode
      });
    } // Implicit directory


    if (this.listings.has(p)) {
      const uid = this.stats.uid;
      const gid = this.stats.gid;
      const size = 0;
      const blksize = 512;
      const blocks = 0;
      const atimeMs = this.stats.mtimeMs;
      const birthtimeMs = this.stats.mtimeMs;
      const ctimeMs = this.stats.mtimeMs;
      const mtimeMs = this.stats.mtimeMs;
      const atime = new Date(atimeMs);
      const birthtime = new Date(birthtimeMs);
      const ctime = new Date(ctimeMs);
      const mtime = new Date(mtimeMs);
      const mode = S_IFDIR | 0o755;
      return Object.assign(new StatEntry(), {
        uid,
        gid,
        size,
        blksize,
        blocks,
        atime,
        birthtime,
        ctime,
        mtime,
        atimeMs,
        birthtimeMs,
        ctimeMs,
        mtimeMs,
        mode
      });
    }

    throw new Error(`Unreachable`);
  }

  getUnixMode(index, defaultMode) {
    const rc = this.libzip.file.getExternalAttributes(this.zip, index, 0, 0, this.libzip.uint08S, this.libzip.uint32S);
    if (rc === -1) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
    const opsys = this.libzip.getValue(this.libzip.uint08S, `i8`) >>> 0;
    if (opsys !== this.libzip.ZIP_OPSYS_UNIX) return defaultMode;
    return this.libzip.getValue(this.libzip.uint32S, `i32`) >>> 16;
  }

  registerListing(p) {
    let listing = this.listings.get(p);
    if (listing) return listing;
    const parentListing = this.registerListing(sources_path/* ppath.dirname */.y1.dirname(p));
    listing = new Set();
    parentListing.add(sources_path/* ppath.basename */.y1.basename(p));
    this.listings.set(p, listing);
    return listing;
  }

  registerEntry(p, index) {
    const parentListing = this.registerListing(sources_path/* ppath.dirname */.y1.dirname(p));
    parentListing.add(sources_path/* ppath.basename */.y1.basename(p));
    this.entries.set(p, index);
  }

  resolveFilename(reason, p, resolveLastComponent = true) {
    if (!this.ready) throw EBUSY(`archive closed, ${reason}`);
    let resolvedP = sources_path/* ppath.resolve */.y1.resolve(sources_path/* PortablePath.root */.LZ.root, p);
    if (resolvedP === `/`) return sources_path/* PortablePath.root */.LZ.root;
    const fileIndex = this.entries.get(resolvedP);

    if (resolveLastComponent && fileIndex !== undefined) {
      if (this.symlinkCount !== 0 && this.isSymbolicLink(fileIndex)) {
        const target = this.getFileSource(fileIndex).toString();
        return this.resolveFilename(reason, sources_path/* ppath.resolve */.y1.resolve(sources_path/* ppath.dirname */.y1.dirname(resolvedP), target), true);
      } else {
        return resolvedP;
      }
    }

    while (true) {
      const parentP = this.resolveFilename(reason, sources_path/* ppath.dirname */.y1.dirname(resolvedP), true);
      const isDir = this.listings.has(parentP);
      const doesExist = this.entries.has(parentP);
      if (!isDir && !doesExist) throw ENOENT(reason);
      if (!isDir) throw ENOTDIR(reason);
      resolvedP = sources_path/* ppath.resolve */.y1.resolve(parentP, sources_path/* ppath.basename */.y1.basename(resolvedP));
      if (!resolveLastComponent || this.symlinkCount === 0) break;
      const index = this.libzip.name.locate(this.zip, resolvedP.slice(1));
      if (index === -1) break;

      if (this.isSymbolicLink(index)) {
        const target = this.getFileSource(index).toString();
        resolvedP = sources_path/* ppath.resolve */.y1.resolve(sources_path/* ppath.dirname */.y1.dirname(resolvedP), target);
      } else {
        break;
      }
    }

    return resolvedP;
  }

  allocateBuffer(content) {
    if (!Buffer.isBuffer(content)) content = Buffer.from(content);
    const buffer = this.libzip.malloc(content.byteLength);
    if (!buffer) throw new Error(`Couldn't allocate enough memory`); // Copy the file into the Emscripten heap

    const heap = new Uint8Array(this.libzip.HEAPU8.buffer, buffer, content.byteLength);
    heap.set(content);
    return {
      buffer,
      byteLength: content.byteLength
    };
  }

  allocateUnattachedSource(content) {
    const error = this.libzip.struct.errorS();
    const {
      buffer,
      byteLength
    } = this.allocateBuffer(content);
    const source = this.libzip.source.fromUnattachedBuffer(buffer, byteLength, 0, true, error);

    if (source === 0) {
      this.libzip.free(error);
      throw new Error(this.libzip.error.strerror(error));
    }

    return source;
  }

  allocateSource(content) {
    const {
      buffer,
      byteLength
    } = this.allocateBuffer(content);
    const source = this.libzip.source.fromBuffer(this.zip, buffer, byteLength, 0, true);

    if (source === 0) {
      this.libzip.free(buffer);
      throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
    }

    return source;
  }

  setFileSource(p, content) {
    const target = sources_path/* ppath.relative */.y1.relative(sources_path/* PortablePath.root */.LZ.root, p);
    const lzSource = this.allocateSource(content);

    try {
      const newIndex = this.libzip.file.add(this.zip, target, lzSource, this.libzip.ZIP_FL_OVERWRITE);

      if (this.level !== `mixed`) {
        // Use store for level 0, and deflate for 1..9
        let method;
        if (this.level === 0) method = this.libzip.ZIP_CM_STORE;else method = this.libzip.ZIP_CM_DEFLATE;
        const rc = this.libzip.file.setCompression(this.zip, newIndex, 0, method, this.level);

        if (rc === -1) {
          throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
        }
      }

      return newIndex;
    } catch (error) {
      this.libzip.source.free(lzSource);
      throw error;
    }
  }

  isSymbolicLink(index) {
    if (this.symlinkCount === 0) return false;
    const attrs = this.libzip.file.getExternalAttributes(this.zip, index, 0, 0, this.libzip.uint08S, this.libzip.uint32S);
    if (attrs === -1) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
    const opsys = this.libzip.getValue(this.libzip.uint08S, `i8`) >>> 0;
    if (opsys !== this.libzip.ZIP_OPSYS_UNIX) return false;
    const attributes = this.libzip.getValue(this.libzip.uint32S, `i32`) >>> 16;
    return (attributes & S_IFMT) === S_IFLNK;
  }

  getFileSource(index) {
    const stat = this.libzip.struct.statS();
    const rc = this.libzip.statIndex(this.zip, index, 0, 0, stat);
    if (rc === -1) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
    const size = this.libzip.struct.statSize(stat);
    const buffer = this.libzip.malloc(size);

    try {
      const file = this.libzip.fopenIndex(this.zip, index, 0, 0);
      if (file === 0) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));

      try {
        const rc = this.libzip.fread(file, buffer, size, 0);
        if (rc === -1) throw new Error(this.libzip.error.strerror(this.libzip.file.getError(file)));else if (rc < size) throw new Error(`Incomplete read`);else if (rc > size) throw new Error(`Overread`);
        const memory = this.libzip.HEAPU8.subarray(buffer, buffer + size);
        const data = Buffer.from(memory);
        return data;
      } finally {
        this.libzip.fclose(file);
      }
    } finally {
      this.libzip.free(buffer);
    }
  }

  async chmodPromise(p, mask) {
    return this.chmodSync(p, mask);
  }

  chmodSync(p, mask) {
    if (this.readOnly) throw EROFS(`chmod '${p}'`); // We don't allow to make the extracted entries group-writable

    mask &= 0o755;
    const resolvedP = this.resolveFilename(`chmod '${p}'`, p, false);
    const entry = this.entries.get(resolvedP);
    if (typeof entry === `undefined`) throw new Error(`Assertion failed: The entry should have been registered (${resolvedP})`);
    const oldMod = this.getUnixMode(entry, S_IFREG | 0o000);
    const newMod = oldMod & ~0o777 | mask;
    const rc = this.libzip.file.setExternalAttributes(this.zip, entry, 0, 0, this.libzip.ZIP_OPSYS_UNIX, newMod << 16);

    if (rc === -1) {
      throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
    }
  }

  async renamePromise(oldP, newP) {
    return this.renameSync(oldP, newP);
  }

  renameSync(oldP, newP) {
    throw new Error(`Unimplemented`);
  }

  async copyFilePromise(sourceP, destP, flags) {
    return this.copyFileSync(sourceP, destP, flags);
  }

  copyFileSync(sourceP, destP, flags = 0) {
    if (this.readOnly) throw EROFS(`copyfile '${sourceP} -> '${destP}'`);
    if ((flags & external_fs_.constants.COPYFILE_FICLONE_FORCE) !== 0) throw ENOSYS(`unsupported clone operation`, `copyfile '${sourceP}' -> ${destP}'`);
    const resolvedSourceP = this.resolveFilename(`copyfile '${sourceP} -> ${destP}'`, sourceP);
    const indexSource = this.entries.get(resolvedSourceP);
    if (typeof indexSource === `undefined`) throw EINVAL(`copyfile '${sourceP}' -> '${destP}'`);
    const resolvedDestP = this.resolveFilename(`copyfile '${sourceP}' -> ${destP}'`, destP);
    const indexDest = this.entries.get(resolvedDestP);
    if ((flags & (external_fs_.constants.COPYFILE_EXCL | external_fs_.constants.COPYFILE_FICLONE_FORCE)) !== 0 && typeof indexDest !== `undefined`) throw EEXIST(`copyfile '${sourceP}' -> '${destP}'`);
    const source = this.getFileSource(indexSource);
    const newIndex = this.setFileSource(resolvedDestP, source);

    if (newIndex !== indexDest) {
      this.registerEntry(resolvedDestP, newIndex);
    }
  }

  async appendFilePromise(p, content, opts) {
    return this.appendFileSync(p, content, opts);
  }

  appendFileSync(p, content, opts = {}) {
    if (this.readOnly) throw EROFS(`open '${p}'`);
    if (typeof opts === `undefined`) opts = {
      flag: `a`
    };else if (typeof opts === `string`) opts = {
      flag: `a`,
      encoding: opts
    };else if (typeof opts.flag === `undefined`) opts = {
      flag: `a`,
      ...opts
    };
    return this.writeFileSync(p, content, opts);
  }

  async writeFilePromise(p, content, opts) {
    return this.writeFileSync(p, content, opts);
  }

  writeFileSync(p, content, opts) {
    if (typeof p !== `string`) throw EBADF(`read`);
    if (this.readOnly) throw EROFS(`open '${p}'`);
    const resolvedP = this.resolveFilename(`open '${p}'`, p);
    if (this.listings.has(resolvedP)) throw EISDIR(`open '${p}'`);
    const index = this.entries.get(resolvedP);
    if (index !== undefined && typeof opts === `object` && opts.flag && opts.flag.includes(`a`)) content = Buffer.concat([this.getFileSource(index), Buffer.from(content)]);
    let encoding = null;
    if (typeof opts === `string`) encoding = opts;else if (typeof opts === `object` && opts.encoding) encoding = opts.encoding;
    if (encoding !== null) content = content.toString(encoding);
    const newIndex = this.setFileSource(resolvedP, content);

    if (newIndex !== index) {
      this.registerEntry(resolvedP, newIndex);
    }
  }

  async unlinkPromise(p) {
    return this.unlinkSync(p);
  }

  unlinkSync(p) {
    throw new Error(`Unimplemented`);
  }

  async utimesPromise(p, atime, mtime) {
    return this.utimesSync(p, atime, mtime);
  }

  utimesSync(p, atime, mtime) {
    if (this.readOnly) throw EROFS(`utimes '${p}'`);
    const resolvedP = this.resolveFilename(`utimes '${p}'`, p);
    this.utimesImpl(resolvedP, mtime);
  }

  async lutimesPromise(p, atime, mtime) {
    return this.lutimesSync(p, atime, mtime);
  }

  lutimesSync(p, atime, mtime) {
    if (this.readOnly) throw EROFS(`lutimes '${p}'`);
    const resolvedP = this.resolveFilename(`utimes '${p}'`, p, false);
    this.utimesImpl(resolvedP, mtime);
  }

  utimesImpl(resolvedP, mtime) {
    if (this.listings.has(resolvedP)) if (!this.entries.has(resolvedP)) this.hydrateDirectory(resolvedP);
    const entry = this.entries.get(resolvedP);
    if (entry === undefined) throw new Error(`Unreachable`);
    const rc = this.libzip.file.setMtime(this.zip, entry, 0, toUnixTimestamp(mtime), 0);

    if (rc === -1) {
      throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
    }
  }

  async mkdirPromise(p, opts) {
    return this.mkdirSync(p, opts);
  }

  mkdirSync(p, {
    mode = 0o755,
    recursive = false
  } = {}) {
    if (recursive) {
      this.mkdirpSync(p, {
        chmod: mode
      });
      return;
    }

    if (this.readOnly) throw EROFS(`mkdir '${p}'`);
    const resolvedP = this.resolveFilename(`mkdir '${p}'`, p);
    if (this.entries.has(resolvedP) || this.listings.has(resolvedP)) throw EEXIST(`mkdir '${p}'`);
    this.hydrateDirectory(resolvedP);
    this.chmodSync(resolvedP, mode);
  }

  async rmdirPromise(p) {
    return this.rmdirSync(p);
  }

  rmdirSync(p) {
    throw new Error(`Unimplemented`);
  }

  hydrateDirectory(resolvedP) {
    const index = this.libzip.dir.add(this.zip, sources_path/* ppath.relative */.y1.relative(sources_path/* PortablePath.root */.LZ.root, resolvedP));
    if (index === -1) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
    this.registerListing(resolvedP);
    this.registerEntry(resolvedP, index);
    return index;
  }

  async symlinkPromise(target, p) {
    return this.symlinkSync(target, p);
  }

  symlinkSync(target, p) {
    if (this.readOnly) throw EROFS(`symlink '${target}' -> '${p}'`);
    const resolvedP = this.resolveFilename(`symlink '${target}' -> '${p}'`, p);
    if (this.listings.has(resolvedP)) throw EISDIR(`symlink '${target}' -> '${p}'`);
    if (this.entries.has(resolvedP)) throw EEXIST(`symlink '${target}' -> '${p}'`);
    const index = this.setFileSource(resolvedP, target);
    this.registerEntry(resolvedP, index);
    const rc = this.libzip.file.setExternalAttributes(this.zip, index, 0, 0, this.libzip.ZIP_OPSYS_UNIX, (0o120000 | 0o777) << 16);
    if (rc === -1) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
    this.symlinkCount += 1;
  }

  async readFilePromise(p, encoding) {
    // This weird switch is required to tell TypeScript that the signatures are proper (otherwise it thinks that only the generic one is covered)
    switch (encoding) {
      case `utf8`:
        return this.readFileSync(p, encoding);

      default:
        return this.readFileSync(p, encoding);
    }
  }

  readFileSync(p, encoding) {
    if (typeof p !== `string`) throw EBADF(`read`); // This is messed up regarding the TS signatures

    if (typeof encoding === `object`) // @ts-ignore
      encoding = encoding ? encoding.encoding : undefined;
    const resolvedP = this.resolveFilename(`open '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`open '${p}'`); // Ensures that the last component is a directory, if the user said so (even if it is we'll throw right after with EISDIR anyway)

    if (p[p.length - 1] === `/` && !this.listings.has(resolvedP)) throw ENOTDIR(`open '${p}'`);
    if (this.listings.has(resolvedP)) throw EISDIR(`read`);
    const entry = this.entries.get(resolvedP);
    if (entry === undefined) throw new Error(`Unreachable`);
    const data = this.getFileSource(entry);
    return encoding ? data.toString(encoding) : data;
  }

  async readdirPromise(p, {
    withFileTypes
  } = {}) {
    return this.readdirSync(p, {
      withFileTypes: withFileTypes
    });
  }

  readdirSync(p, {
    withFileTypes
  } = {}) {
    const resolvedP = this.resolveFilename(`scandir '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`scandir '${p}'`);
    const directoryListing = this.listings.get(resolvedP);
    if (!directoryListing) throw ENOTDIR(`scandir '${p}'`);
    const entries = [...directoryListing];
    if (!withFileTypes) return entries;
    return entries.map(name => {
      return Object.assign(this.statImpl(`lstat`, sources_path/* ppath.join */.y1.join(p, name)), {
        name
      });
    });
  }

  async readlinkPromise(p) {
    return this.readlinkSync(p);
  }

  readlinkSync(p) {
    const resolvedP = this.resolveFilename(`readlink '${p}'`, p, false);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`readlink '${p}'`); // Ensure that the last component is a directory (if it is we'll throw right after with EISDIR anyway)

    if (p[p.length - 1] === `/` && !this.listings.has(resolvedP)) throw ENOTDIR(`open '${p}'`);
    if (this.listings.has(resolvedP)) throw EINVAL(`readlink '${p}'`);
    const entry = this.entries.get(resolvedP);
    if (entry === undefined) throw new Error(`Unreachable`);
    const rc = this.libzip.file.getExternalAttributes(this.zip, entry, 0, 0, this.libzip.uint08S, this.libzip.uint32S);
    if (rc === -1) throw new Error(this.libzip.error.strerror(this.libzip.getError(this.zip)));
    const opsys = this.libzip.getValue(this.libzip.uint08S, `i8`) >>> 0;
    if (opsys !== this.libzip.ZIP_OPSYS_UNIX) throw EINVAL(`readlink '${p}'`);
    const attributes = this.libzip.getValue(this.libzip.uint32S, `i32`) >>> 16;
    if ((attributes & 0o170000) !== 0o120000) throw EINVAL(`readlink '${p}'`);
    return this.getFileSource(entry).toString();
  }

  watch(p, a, b) {
    let persistent;

    switch (typeof a) {
      case `function`:
      case `string`:
      case `undefined`:
        {
          persistent = true;
        }
        break;

      default:
        {
          // @ts-ignore
          ({
            persistent = true
          } = a);
        }
        break;
    }

    if (!persistent) return {
      on: () => {},
      close: () => {}
    };
    const interval = setInterval(() => {}, 24 * 60 * 60 * 1000);
    return {
      on: () => {},
      close: () => {
        clearInterval(interval);
      }
    };
  }

}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/ZipOpenFS.ts





const ZIP_FD = 0x80000000;
const FILE_PARTS_REGEX = /.*?(?<!\/)\.zip(?=\/|$)/;
class ZipOpenFS extends FakeFS/* BasePortableFakeFS */.fS {
  constructor({
    libzip,
    baseFs = new NodeFS(),
    filter = null,
    maxOpenFiles = Infinity,
    readOnlyArchives = false,
    useCache = true
  }) {
    super();
    this.fdMap = new Map();
    this.nextFd = 3;
    this.isZip = new Set();
    this.notZip = new Set();
    this.libzip = libzip;
    this.baseFs = baseFs;
    this.zipInstances = useCache ? new Map() : null;
    this.filter = filter;
    this.maxOpenFiles = maxOpenFiles;
    this.readOnlyArchives = readOnlyArchives;
  }

  static async openPromise(fn, opts) {
    const zipOpenFs = new ZipOpenFS(opts);

    try {
      return await fn(zipOpenFs);
    } finally {
      zipOpenFs.saveAndClose();
    }
  }

  getExtractHint(hints) {
    return this.baseFs.getExtractHint(hints);
  }

  getRealPath() {
    return this.baseFs.getRealPath();
  }

  saveAndClose() {
    if (this.zipInstances) {
      for (const [path, zipFs] of this.zipInstances.entries()) {
        zipFs.saveAndClose();
        this.zipInstances.delete(path);
      }
    }
  }

  discardAndClose() {
    if (this.zipInstances) {
      for (const [path, zipFs] of this.zipInstances.entries()) {
        zipFs.discardAndClose();
        this.zipInstances.delete(path);
      }
    }
  }

  resolve(p) {
    return this.baseFs.resolve(p);
  }

  remapFd(zipFs, fd) {
    const remappedFd = this.nextFd++ | ZIP_FD;
    this.fdMap.set(remappedFd, [zipFs, fd]);
    return remappedFd;
  }

  async openPromise(p, flags, mode) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.openPromise(p, flags, mode);
    }, async (zipFs, {
      subPath
    }) => {
      return this.remapFd(zipFs, await zipFs.openPromise(subPath, flags, mode));
    });
  }

  openSync(p, flags, mode) {
    return this.makeCallSync(p, () => {
      return this.baseFs.openSync(p, flags, mode);
    }, (zipFs, {
      subPath
    }) => {
      return this.remapFd(zipFs, zipFs.openSync(subPath, flags, mode));
    });
  }

  async readPromise(fd, buffer, offset, length, position) {
    if ((fd & ZIP_FD) === 0) return await this.baseFs.readPromise(fd, buffer, offset, length, position);
    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, read`), {
      code: `EBADF`
    });
    const [zipFs, realFd] = entry;
    return await zipFs.readPromise(realFd, buffer, offset, length, position);
  }

  readSync(fd, buffer, offset, length, position) {
    if ((fd & ZIP_FD) === 0) return this.baseFs.readSync(fd, buffer, offset, length, position);
    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, read`), {
      code: `EBADF`
    });
    const [zipFs, realFd] = entry;
    return zipFs.readSync(realFd, buffer, offset, length, position);
  }

  async writePromise(fd, buffer, offset, length, position) {
    if ((fd & ZIP_FD) === 0) {
      if (typeof buffer === `string`) {
        return await this.baseFs.writePromise(fd, buffer, offset);
      } else {
        return await this.baseFs.writePromise(fd, buffer, offset, length, position);
      }
    }

    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, write`), {
      code: `EBADF`
    });
    const [zipFs, realFd] = entry;

    if (typeof buffer === `string`) {
      return await zipFs.writePromise(realFd, buffer, offset);
    } else {
      return await zipFs.writePromise(realFd, buffer, offset, length, position);
    }
  }

  writeSync(fd, buffer, offset, length, position) {
    if ((fd & ZIP_FD) === 0) {
      if (typeof buffer === `string`) {
        return this.baseFs.writeSync(fd, buffer, offset);
      } else {
        return this.baseFs.writeSync(fd, buffer, offset, length, position);
      }
    }

    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, write`), {
      code: `EBADF`
    });
    const [zipFs, realFd] = entry;

    if (typeof buffer === `string`) {
      return zipFs.writeSync(realFd, buffer, offset);
    } else {
      return zipFs.writeSync(realFd, buffer, offset, length, position);
    }
  }

  async closePromise(fd) {
    if ((fd & ZIP_FD) === 0) return await this.baseFs.closePromise(fd);
    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, close`), {
      code: `EBADF`
    });
    this.fdMap.delete(fd);
    const [zipFs, realFd] = entry;
    return await zipFs.closePromise(realFd);
  }

  closeSync(fd) {
    if ((fd & ZIP_FD) === 0) return this.baseFs.closeSync(fd);
    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, close`), {
      code: `EBADF`
    });
    this.fdMap.delete(fd);
    const [zipFs, realFd] = entry;
    return zipFs.closeSync(realFd);
  }

  createReadStream(p, opts) {
    if (p === null) return this.baseFs.createReadStream(p, opts);
    return this.makeCallSync(p, () => {
      return this.baseFs.createReadStream(p, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.createReadStream(subPath, opts);
    });
  }

  createWriteStream(p, opts) {
    if (p === null) return this.baseFs.createWriteStream(p, opts);
    return this.makeCallSync(p, () => {
      return this.baseFs.createWriteStream(p, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.createWriteStream(subPath, opts);
    });
  }

  async realpathPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.realpathPromise(p);
    }, async (zipFs, {
      archivePath,
      subPath
    }) => {
      return this.pathUtils.resolve(await this.baseFs.realpathPromise(archivePath), this.pathUtils.relative(sources_path/* PortablePath.root */.LZ.root, await zipFs.realpathPromise(subPath)));
    });
  }

  realpathSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.realpathSync(p);
    }, (zipFs, {
      archivePath,
      subPath
    }) => {
      return this.pathUtils.resolve(this.baseFs.realpathSync(archivePath), this.pathUtils.relative(sources_path/* PortablePath.root */.LZ.root, zipFs.realpathSync(subPath)));
    });
  }

  async existsPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.existsPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.existsPromise(subPath);
    });
  }

  existsSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.existsSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.existsSync(subPath);
    });
  }

  async accessPromise(p, mode) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.accessPromise(p, mode);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.accessPromise(subPath, mode);
    });
  }

  accessSync(p, mode) {
    return this.makeCallSync(p, () => {
      return this.baseFs.accessSync(p, mode);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.accessSync(subPath, mode);
    });
  }

  async statPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.statPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.statPromise(subPath);
    });
  }

  statSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.statSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.statSync(subPath);
    });
  }

  async lstatPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.lstatPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.lstatPromise(subPath);
    });
  }

  lstatSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.lstatSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.lstatSync(subPath);
    });
  }

  async chmodPromise(p, mask) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.chmodPromise(p, mask);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.chmodPromise(subPath, mask);
    });
  }

  chmodSync(p, mask) {
    return this.makeCallSync(p, () => {
      return this.baseFs.chmodSync(p, mask);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.chmodSync(subPath, mask);
    });
  }

  async renamePromise(oldP, newP) {
    return await this.makeCallPromise(oldP, async () => {
      return await this.makeCallPromise(newP, async () => {
        return await this.baseFs.renamePromise(oldP, newP);
      }, async () => {
        throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
          code: `EEXDEV`
        });
      });
    }, async (zipFsO, {
      subPath: subPathO
    }) => {
      return await this.makeCallPromise(newP, async () => {
        throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
          code: `EEXDEV`
        });
      }, async (zipFsN, {
        subPath: subPathN
      }) => {
        if (zipFsO !== zipFsN) {
          throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
            code: `EEXDEV`
          });
        } else {
          return await zipFsO.renamePromise(subPathO, subPathN);
        }
      });
    });
  }

  renameSync(oldP, newP) {
    return this.makeCallSync(oldP, () => {
      return this.makeCallSync(newP, () => {
        return this.baseFs.renameSync(oldP, newP);
      }, async () => {
        throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
          code: `EEXDEV`
        });
      });
    }, (zipFsO, {
      subPath: subPathO
    }) => {
      return this.makeCallSync(newP, () => {
        throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
          code: `EEXDEV`
        });
      }, (zipFsN, {
        subPath: subPathN
      }) => {
        if (zipFsO !== zipFsN) {
          throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
            code: `EEXDEV`
          });
        } else {
          return zipFsO.renameSync(subPathO, subPathN);
        }
      });
    });
  }

  async copyFilePromise(sourceP, destP, flags = 0) {
    const fallback = async (sourceFs, sourceP, destFs, destP) => {
      if ((flags & external_fs_.constants.COPYFILE_FICLONE_FORCE) !== 0) throw Object.assign(new Error(`EXDEV: cross-device clone not permitted, copyfile '${sourceP}' -> ${destP}'`), {
        code: `EXDEV`
      });
      if (flags & external_fs_.constants.COPYFILE_EXCL && (await this.existsPromise(sourceP))) throw Object.assign(new Error(`EEXIST: file already exists, copyfile '${sourceP}' -> '${destP}'`), {
        code: `EEXIST`
      });
      let content;

      try {
        content = await sourceFs.readFilePromise(sourceP);
      } catch (error) {
        throw Object.assign(new Error(`EINVAL: invalid argument, copyfile '${sourceP}' -> '${destP}'`), {
          code: `EINVAL`
        });
      }

      await destFs.writeFilePromise(destP, content);
    };

    return await this.makeCallPromise(sourceP, async () => {
      return await this.makeCallPromise(destP, async () => {
        return await this.baseFs.copyFilePromise(sourceP, destP, flags);
      }, async (zipFsD, {
        subPath: subPathD
      }) => {
        return await fallback(this.baseFs, sourceP, zipFsD, subPathD);
      });
    }, async (zipFsS, {
      subPath: subPathS
    }) => {
      return await this.makeCallPromise(destP, async () => {
        return await fallback(zipFsS, subPathS, this.baseFs, destP);
      }, async (zipFsD, {
        subPath: subPathD
      }) => {
        if (zipFsS !== zipFsD) {
          return await fallback(zipFsS, subPathS, zipFsD, subPathD);
        } else {
          return await zipFsS.copyFilePromise(subPathS, subPathD, flags);
        }
      });
    });
  }

  copyFileSync(sourceP, destP, flags = 0) {
    const fallback = (sourceFs, sourceP, destFs, destP) => {
      if ((flags & external_fs_.constants.COPYFILE_FICLONE_FORCE) !== 0) throw Object.assign(new Error(`EXDEV: cross-device clone not permitted, copyfile '${sourceP}' -> ${destP}'`), {
        code: `EXDEV`
      });
      if (flags & external_fs_.constants.COPYFILE_EXCL && this.existsSync(sourceP)) throw Object.assign(new Error(`EEXIST: file already exists, copyfile '${sourceP}' -> '${destP}'`), {
        code: `EEXIST`
      });
      let content;

      try {
        content = sourceFs.readFileSync(sourceP);
      } catch (error) {
        throw Object.assign(new Error(`EINVAL: invalid argument, copyfile '${sourceP}' -> '${destP}'`), {
          code: `EINVAL`
        });
      }

      destFs.writeFileSync(destP, content);
    };

    return this.makeCallSync(sourceP, () => {
      return this.makeCallSync(destP, () => {
        return this.baseFs.copyFileSync(sourceP, destP, flags);
      }, (zipFsD, {
        subPath: subPathD
      }) => {
        return fallback(this.baseFs, sourceP, zipFsD, subPathD);
      });
    }, (zipFsS, {
      subPath: subPathS
    }) => {
      return this.makeCallSync(destP, () => {
        return fallback(zipFsS, subPathS, this.baseFs, destP);
      }, (zipFsD, {
        subPath: subPathD
      }) => {
        if (zipFsS !== zipFsD) {
          return fallback(zipFsS, subPathS, zipFsD, subPathD);
        } else {
          return zipFsS.copyFileSync(subPathS, subPathD, flags);
        }
      });
    });
  }

  async appendFilePromise(p, content, opts) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.appendFilePromise(p, content, opts);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.appendFilePromise(subPath, content, opts);
    });
  }

  appendFileSync(p, content, opts) {
    return this.makeCallSync(p, () => {
      return this.baseFs.appendFileSync(p, content, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.appendFileSync(subPath, content, opts);
    });
  }

  async writeFilePromise(p, content, opts) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.writeFilePromise(p, content, opts);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.writeFilePromise(subPath, content, opts);
    });
  }

  writeFileSync(p, content, opts) {
    return this.makeCallSync(p, () => {
      return this.baseFs.writeFileSync(p, content, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.writeFileSync(subPath, content, opts);
    });
  }

  async unlinkPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.unlinkPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.unlinkPromise(subPath);
    });
  }

  unlinkSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.unlinkSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.unlinkSync(subPath);
    });
  }

  async utimesPromise(p, atime, mtime) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.utimesPromise(p, atime, mtime);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.utimesPromise(subPath, atime, mtime);
    });
  }

  utimesSync(p, atime, mtime) {
    return this.makeCallSync(p, () => {
      return this.baseFs.utimesSync(p, atime, mtime);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.utimesSync(subPath, atime, mtime);
    });
  }

  async mkdirPromise(p, opts) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.mkdirPromise(p, opts);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.mkdirPromise(subPath, opts);
    });
  }

  mkdirSync(p, opts) {
    return this.makeCallSync(p, () => {
      return this.baseFs.mkdirSync(p, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.mkdirSync(subPath, opts);
    });
  }

  async rmdirPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.rmdirPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.rmdirPromise(subPath);
    });
  }

  rmdirSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.rmdirSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.rmdirSync(subPath);
    });
  }

  async symlinkPromise(target, p, type) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.symlinkPromise(target, p, type);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.symlinkPromise(target, subPath);
    });
  }

  symlinkSync(target, p, type) {
    return this.makeCallSync(p, () => {
      return this.baseFs.symlinkSync(target, p, type);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.symlinkSync(target, subPath);
    });
  }

  async readFilePromise(p, encoding) {
    return this.makeCallPromise(p, async () => {
      // This weird switch is required to tell TypeScript that the signatures are proper (otherwise it thinks that only the generic one is covered)
      switch (encoding) {
        case `utf8`:
          return await this.baseFs.readFilePromise(p, encoding);

        default:
          return await this.baseFs.readFilePromise(p, encoding);
      }
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.readFilePromise(subPath, encoding);
    });
  }

  readFileSync(p, encoding) {
    return this.makeCallSync(p, () => {
      // This weird switch is required to tell TypeScript that the signatures are proper (otherwise it thinks that only the generic one is covered)
      switch (encoding) {
        case `utf8`:
          return this.baseFs.readFileSync(p, encoding);

        default:
          return this.baseFs.readFileSync(p, encoding);
      }
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.readFileSync(subPath, encoding);
    });
  }

  async readdirPromise(p, {
    withFileTypes
  } = {}) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.readdirPromise(p, {
        withFileTypes: withFileTypes
      });
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.readdirPromise(subPath, {
        withFileTypes: withFileTypes
      });
    }, {
      requireSubpath: false
    });
  }

  readdirSync(p, {
    withFileTypes
  } = {}) {
    return this.makeCallSync(p, () => {
      return this.baseFs.readdirSync(p, {
        withFileTypes: withFileTypes
      });
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.readdirSync(subPath, {
        withFileTypes: withFileTypes
      });
    }, {
      requireSubpath: false
    });
  }

  async readlinkPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.readlinkPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.readlinkPromise(subPath);
    });
  }

  readlinkSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.readlinkSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.readlinkSync(subPath);
    });
  }

  watch(p, a, b) {
    return this.makeCallSync(p, () => {
      return this.baseFs.watch(p, // @ts-ignore
      a, b);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.watch(subPath, // @ts-ignore
      a, b);
    });
  }

  async makeCallPromise(p, discard, accept, {
    requireSubpath = true
  } = {}) {
    if (typeof p !== `string`) return await discard();
    const normalizedP = this.resolve(p);
    const zipInfo = this.findZip(normalizedP);
    if (!zipInfo) return await discard();
    if (requireSubpath && zipInfo.subPath === `/`) return await discard();
    return await this.getZipPromise(zipInfo.archivePath, async zipFs => await accept(zipFs, zipInfo));
  }

  makeCallSync(p, discard, accept, {
    requireSubpath = true
  } = {}) {
    if (typeof p !== `string`) return discard();
    const normalizedP = this.resolve(p);
    const zipInfo = this.findZip(normalizedP);
    if (!zipInfo) return discard();
    if (requireSubpath && zipInfo.subPath === `/`) return discard();
    return this.getZipSync(zipInfo.archivePath, zipFs => accept(zipFs, zipInfo));
  }

  findZip(p) {
    if (this.filter && !this.filter.test(p)) return null;
    let filePath = ``;

    while (true) {
      const parts = FILE_PARTS_REGEX.exec(p.substr(filePath.length));
      if (!parts) return null;
      filePath = this.pathUtils.join(filePath, parts[0]);

      if (this.isZip.has(filePath) === false) {
        if (this.notZip.has(filePath)) continue;

        try {
          if (!this.baseFs.lstatSync(filePath).isFile()) {
            this.notZip.add(filePath);
            continue;
          }
        } catch (_a) {
          return null;
        }

        this.isZip.add(filePath);
      }

      return {
        archivePath: filePath,
        subPath: this.pathUtils.resolve(sources_path/* PortablePath.root */.LZ.root, p.substr(filePath.length))
      };
    }
  }

  limitOpenFiles(max) {
    if (this.zipInstances === null) return;
    let closeCount = this.zipInstances.size - max;

    for (const [path, zipFs] of this.zipInstances.entries()) {
      if (closeCount <= 0) break;
      zipFs.saveAndClose();
      this.zipInstances.delete(path);
      closeCount -= 1;
    }
  }

  async getZipPromise(p, accept) {
    const getZipOptions = async () => ({
      baseFs: this.baseFs,
      libzip: this.libzip,
      readOnly: this.readOnlyArchives,
      stats: await this.baseFs.statPromise(p)
    });

    if (this.zipInstances) {
      let zipFs = this.zipInstances.get(p);

      if (!zipFs) {
        const zipOptions = await getZipOptions(); // We need to recheck because concurrent getZipPromise calls may
        // have instantiated the zip archive while we were waiting

        zipFs = this.zipInstances.get(p);

        if (!zipFs) {
          zipFs = new ZipFS(p, zipOptions);
        }
      } // Removing then re-adding the field allows us to easily implement
      // a basic LRU garbage collection strategy


      this.zipInstances.delete(p);
      this.zipInstances.set(p, zipFs);
      this.limitOpenFiles(this.maxOpenFiles);
      return await accept(zipFs);
    } else {
      const zipFs = new ZipFS(p, await getZipOptions());

      try {
        return await accept(zipFs);
      } finally {
        zipFs.saveAndClose();
      }
    }
  }

  getZipSync(p, accept) {
    const getZipOptions = () => ({
      baseFs: this.baseFs,
      libzip: this.libzip,
      readOnly: this.readOnlyArchives,
      stats: this.baseFs.statSync(p)
    });

    if (this.zipInstances) {
      let zipFs = this.zipInstances.get(p);
      if (!zipFs) zipFs = new ZipFS(p, getZipOptions()); // Removing then re-adding the field allows us to easily implement
      // a basic LRU garbage collection strategy

      this.zipInstances.delete(p);
      this.zipInstances.set(p, zipFs);
      this.limitOpenFiles(this.maxOpenFiles);
      return accept(zipFs);
    } else {
      const zipFs = new ZipFS(p, getZipOptions());

      try {
        return accept(zipFs);
      } finally {
        zipFs.saveAndClose();
      }
    }
  }

}
// CONCATENATED MODULE: ../yarnpkg-libzip/sources/makeInterface.ts
const number64 = [`number`, `number`];
const makeInterface = libzip => ({
  // Those are getters because they can change after memory growth
  get HEAP8() {
    return libzip.HEAP8;
  },

  get HEAPU8() {
    return libzip.HEAPU8;
  },

  SEEK_SET: 0,
  SEEK_CUR: 1,
  SEEK_END: 2,
  ZIP_CHECKCONS: 4,
  ZIP_CREATE: 1,
  ZIP_EXCL: 2,
  ZIP_TRUNCATE: 8,
  ZIP_RDONLY: 16,
  ZIP_FL_OVERWRITE: 8192,
  ZIP_OPSYS_DOS: 0x00,
  ZIP_OPSYS_AMIGA: 0x01,
  ZIP_OPSYS_OPENVMS: 0x02,
  ZIP_OPSYS_UNIX: 0x03,
  ZIP_OPSYS_VM_CMS: 0x04,
  ZIP_OPSYS_ATARI_ST: 0x05,
  ZIP_OPSYS_OS_2: 0x06,
  ZIP_OPSYS_MACINTOSH: 0x07,
  ZIP_OPSYS_Z_SYSTEM: 0x08,
  ZIP_OPSYS_CPM: 0x09,
  ZIP_OPSYS_WINDOWS_NTFS: 0x0a,
  ZIP_OPSYS_MVS: 0x0b,
  ZIP_OPSYS_VSE: 0x0c,
  ZIP_OPSYS_ACORN_RISC: 0x0d,
  ZIP_OPSYS_VFAT: 0x0e,
  ZIP_OPSYS_ALTERNATE_MVS: 0x0f,
  ZIP_OPSYS_BEOS: 0x10,
  ZIP_OPSYS_TANDEM: 0x11,
  ZIP_OPSYS_OS_400: 0x12,
  ZIP_OPSYS_OS_X: 0x13,
  ZIP_CM_DEFAULT: -1,
  ZIP_CM_STORE: 0,
  ZIP_CM_DEFLATE: 8,
  uint08S: libzip._malloc(1),
  uint16S: libzip._malloc(2),
  uint32S: libzip._malloc(4),
  uint64S: libzip._malloc(8),
  malloc: libzip._malloc,
  free: libzip._free,
  getValue: libzip.getValue,
  open: libzip.cwrap(`zip_open`, `number`, [`string`, `number`, `number`]),
  openFromSource: libzip.cwrap(`zip_open_from_source`, `number`, [`number`, `number`, `number`]),
  close: libzip.cwrap(`zip_close`, `number`, [`number`]),
  discard: libzip.cwrap(`zip_discard`, null, [`number`]),
  getError: libzip.cwrap(`zip_get_error`, `number`, [`number`]),
  getName: libzip.cwrap(`zip_get_name`, `string`, [`number`, `number`, `number`]),
  getNumEntries: libzip.cwrap(`zip_get_num_entries`, `number`, [`number`, `number`]),
  stat: libzip.cwrap(`zip_stat`, `number`, [`number`, `string`, `number`, `number`]),
  statIndex: libzip.cwrap(`zip_stat_index`, `number`, [`number`, ...number64, `number`, `number`]),
  fopen: libzip.cwrap(`zip_fopen`, `number`, [`number`, `string`, `number`]),
  fopenIndex: libzip.cwrap(`zip_fopen_index`, `number`, [`number`, ...number64, `number`]),
  fread: libzip.cwrap(`zip_fread`, `number`, [`number`, `number`, `number`, `number`]),
  fclose: libzip.cwrap(`zip_fclose`, `number`, [`number`]),
  dir: {
    add: libzip.cwrap(`zip_dir_add`, `number`, [`number`, `string`])
  },
  file: {
    add: libzip.cwrap(`zip_file_add`, `number`, [`number`, `string`, `number`, `number`]),
    getError: libzip.cwrap(`zip_file_get_error`, `number`, [`number`]),
    getExternalAttributes: libzip.cwrap(`zip_file_get_external_attributes`, `number`, [`number`, ...number64, `number`, `number`, `number`]),
    setExternalAttributes: libzip.cwrap(`zip_file_set_external_attributes`, `number`, [`number`, ...number64, `number`, `number`, `number`]),
    setMtime: libzip.cwrap(`zip_file_set_mtime`, `number`, [`number`, ...number64, `number`, `number`]),
    setCompression: libzip.cwrap(`zip_set_file_compression`, `number`, [`number`, ...number64, `number`, `number`])
  },
  ext: {
    countSymlinks: libzip.cwrap(`zip_ext_count_symlinks`, `number`, [`number`])
  },
  error: {
    initWithCode: libzip.cwrap(`zip_error_init_with_code`, null, [`number`, `number`]),
    strerror: libzip.cwrap(`zip_error_strerror`, `string`, [`number`])
  },
  name: {
    locate: libzip.cwrap(`zip_name_locate`, `number`, [`number`, `string`, `number`])
  },
  source: {
    fromUnattachedBuffer: libzip.cwrap(`zip_source_buffer_create`, `number`, [`number`, `number`, `number`, `number`]),
    fromBuffer: libzip.cwrap(`zip_source_buffer`, `number`, [`number`, `number`, ...number64, `number`]),
    free: libzip.cwrap(`zip_source_free`, null, [`number`]),
    keep: libzip.cwrap(`zip_source_keep`, null, [`number`]),
    open: libzip.cwrap(`zip_source_open`, `number`, [`number`]),
    close: libzip.cwrap(`zip_source_close`, `number`, [`number`]),
    seek: libzip.cwrap(`zip_source_seek`, `number`, [`number`, ...number64, `number`]),
    tell: libzip.cwrap(`zip_source_tell`, `number`, [`number`]),
    read: libzip.cwrap(`zip_source_read`, `number`, [`number`, `number`, `number`]),
    error: libzip.cwrap(`zip_source_error`, `number`, [`number`]),
    setMtime: libzip.cwrap(`zip_source_set_mtime`, `number`, [`number`, `number`])
  },
  struct: {
    stat: libzip.cwrap(`zipstruct_stat`, `number`, []),
    statS: libzip.cwrap(`zipstruct_statS`, `number`, []),
    statName: libzip.cwrap(`zipstruct_stat_name`, `string`, [`number`]),
    statIndex: libzip.cwrap(`zipstruct_stat_index`, `number`, [`number`]),
    statSize: libzip.cwrap(`zipstruct_stat_size`, `number`, [`number`]),
    statMtime: libzip.cwrap(`zipstruct_stat_mtime`, `number`, [`number`]),
    error: libzip.cwrap(`zipstruct_error`, `number`, []),
    errorS: libzip.cwrap(`zipstruct_errorS`, `number`, [])
  }
});
// CONCATENATED MODULE: ../yarnpkg-libzip/sources/sync.ts

let mod = null;
function getLibzipSync() {
  if (mod === null) mod = makeInterface(__webpack_require__(368));
  return mod;
}
async function getLibzipPromise() {
  return getLibzipSync();
}
// EXTERNAL MODULE: external "module"
var external_module_ = __webpack_require__(282);
var external_module_default = /*#__PURE__*/__webpack_require__.n(external_module_);

// EXTERNAL MODULE: external "string_decoder"
var external_string_decoder_ = __webpack_require__(304);
var external_string_decoder_default = /*#__PURE__*/__webpack_require__.n(external_string_decoder_);

// EXTERNAL MODULE: external "os"
var external_os_ = __webpack_require__(87);
var external_os_default = /*#__PURE__*/__webpack_require__.n(external_os_);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/index.ts





















function getTempName(prefix) {
  const tmpdir = sources_path/* npath.toPortablePath */.cS.toPortablePath(external_os_default().tmpdir());
  const hash = Math.ceil(Math.random() * 0x100000000).toString(16).padStart(8, `0`);
  return sources_path/* ppath.join */.y1.join(tmpdir, `${prefix}${hash}`);
}

function patchFs(patchedFs, fakeFs) {
  const SYNC_IMPLEMENTATIONS = new Set([`accessSync`, `appendFileSync`, `createReadStream`, `chmodSync`, `closeSync`, `copyFileSync`, `lstatSync`, `lutimesSync`, `mkdirSync`, `openSync`, `readSync`, `readlinkSync`, `readFileSync`, `readdirSync`, `readlinkSync`, `realpathSync`, `renameSync`, `rmdirSync`, `statSync`, `symlinkSync`, `unlinkSync`, `utimesSync`, `watch`, `writeFileSync`, `writeSync`]);
  const ASYNC_IMPLEMENTATIONS = new Set([`accessPromise`, `appendFilePromise`, `chmodPromise`, `closePromise`, `copyFilePromise`, `lstatPromise`, `lutimesPromise`, `mkdirPromise`, `openPromise`, `readdirPromise`, `realpathPromise`, `readFilePromise`, `readdirPromise`, `readlinkPromise`, `renamePromise`, `rmdirPromise`, `statPromise`, `symlinkPromise`, `unlinkPromise`, `utimesPromise`, `writeFilePromise`, `writeSync`]);

  const setupFn = (target, name, replacement) => {
    const orig = target[name];
    target[name] = replacement;

    if (typeof orig[external_util_.promisify.custom] !== `undefined`) {
      replacement[external_util_.promisify.custom] = orig[external_util_.promisify.custom];
    }
  };
  /** Callback implementations */


  {
    setupFn(patchedFs, `exists`, (p, ...args) => {
      const hasCallback = typeof args[args.length - 1] === `function`;
      const callback = hasCallback ? args.pop() : () => {};
      process.nextTick(() => {
        fakeFs.existsPromise(p).then(exists => {
          callback(exists);
        }, () => {
          callback(false);
        });
      });
    });
    setupFn(patchedFs, `read`, (p, buffer, ...args) => {
      const hasCallback = typeof args[args.length - 1] === `function`;
      const callback = hasCallback ? args.pop() : () => {};
      process.nextTick(() => {
        fakeFs.readPromise(p, buffer, ...args).then(bytesRead => {
          callback(null, bytesRead, buffer);
        }, error => {
          callback(error);
        });
      });
    });

    for (const fnName of ASYNC_IMPLEMENTATIONS) {
      const origName = fnName.replace(/Promise$/, ``);
      if (typeof patchedFs[origName] === `undefined`) continue;
      const fakeImpl = fakeFs[fnName];
      if (typeof fakeImpl === `undefined`) continue;

      const wrapper = (...args) => {
        const hasCallback = typeof args[args.length - 1] === `function`;
        const callback = hasCallback ? args.pop() : () => {};
        process.nextTick(() => {
          fakeImpl.apply(fakeFs, args).then(result => {
            callback(null, result);
          }, error => {
            callback(error);
          });
        });
      };

      setupFn(patchedFs, origName, wrapper);
    }

    patchedFs.realpath.native = patchedFs.realpath;
  }
  /** Sync implementations */

  {
    setupFn(patchedFs, `existsSync`, p => {
      try {
        return fakeFs.existsSync(p);
      } catch (error) {
        return false;
      }
    });

    for (const fnName of SYNC_IMPLEMENTATIONS) {
      const origName = fnName;
      if (typeof patchedFs[origName] === `undefined`) continue;
      const fakeImpl = fakeFs[fnName];
      if (typeof fakeImpl === `undefined`) continue;
      setupFn(patchedFs, origName, fakeImpl.bind(fakeFs));
    }

    patchedFs.realpathSync.native = patchedFs.realpathSync;
  }
  /** Promise implementations */

  {
    // `fs.promises` is a getter that returns a reference to require(`fs/promises`),
    // so we can just patch `fs.promises` and both will be updated
    const patchedFsPromises = patchedFs.promises;

    if (typeof patchedFsPromises !== `undefined`) {
      // `fs.promises.exists` doesn't exist
      for (const fnName of ASYNC_IMPLEMENTATIONS) {
        const origName = fnName.replace(/Promise$/, ``);
        if (typeof patchedFsPromises[origName] === `undefined`) continue;
        const fakeImpl = fakeFs[fnName];
        if (typeof fakeImpl === `undefined`) continue;
        setupFn(patchedFsPromises, origName, fakeImpl.bind(fakeFs));
      } // `fs.promises.realpath` doesn't have a `native` property

    }
  }
}
function extendFs(realFs, fakeFs) {
  const patchedFs = Object.create(realFs);
  patchFs(patchedFs, fakeFs);
  return patchedFs;
}
const tmpdirs = new Set();
let cleanExitRegistered = false;

function registerCleanExit() {
  if (!cleanExitRegistered) cleanExitRegistered = true;else return;

  const cleanExit = () => {
    process.off(`exit`, cleanExit);

    for (const p of tmpdirs) {
      tmpdirs.delete(p);

      try {
        xfs.removeSync(p);
      } catch (_a) {// Too bad if there's an error
      }
    }
  };

  process.on(`exit`, cleanExit);
}

const xfs = Object.assign(new NodeFS(), {
  detachTemp(p) {
    tmpdirs.delete(p);
  },

  mktempSync(cb) {
    registerCleanExit();

    while (true) {
      const p = getTempName(`xfs-`);

      try {
        this.mkdirSync(p);
      } catch (error) {
        if (error.code === `EEXIST`) {
          continue;
        } else {
          throw error;
        }
      }

      const realP = this.realpathSync(p);
      tmpdirs.add(realP);

      if (typeof cb !== `undefined`) {
        try {
          return cb(realP);
        } finally {
          if (tmpdirs.has(realP)) {
            tmpdirs.delete(realP);

            try {
              this.removeSync(realP);
            } catch (_a) {// Too bad if there's an error
            }
          }
        }
      } else {
        return p;
      }
    }
  },

  async mktempPromise(cb) {
    registerCleanExit();

    while (true) {
      const p = getTempName(`xfs-`);

      try {
        await this.mkdirPromise(p);
      } catch (error) {
        if (error.code === `EEXIST`) {
          continue;
        } else {
          throw error;
        }
      }

      const realP = await this.realpathPromise(p);
      tmpdirs.add(realP);

      if (typeof cb !== `undefined`) {
        try {
          return await cb(realP);
        } finally {
          if (tmpdirs.has(realP)) {
            tmpdirs.delete(realP);

            try {
              await this.removePromise(realP);
            } catch (_a) {// Too bad if there's an error
            }
          }
        }
      } else {
        return realP;
      }
    }
  }

});
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/PosixFS.ts


class PosixFS extends ProxiedFS {
  constructor(baseFs) {
    super(sources_path/* npath */.cS);
    this.baseFs = baseFs;
  }

  mapFromBase(path) {
    return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(path);
  }

  mapToBase(path) {
    return sources_path/* npath.toPortablePath */.cS.toPortablePath(path);
  }

}
// EXTERNAL MODULE: external "url"
var external_url_ = __webpack_require__(835);

// CONCATENATED MODULE: ./sources/loader/internalTools.ts
var ErrorCode;

(function (ErrorCode) {
  ErrorCode["API_ERROR"] = "API_ERROR";
  ErrorCode["BLACKLISTED"] = "BLACKLISTED";
  ErrorCode["BUILTIN_NODE_RESOLUTION_FAILED"] = "BUILTIN_NODE_RESOLUTION_FAILED";
  ErrorCode["MISSING_DEPENDENCY"] = "MISSING_DEPENDENCY";
  ErrorCode["MISSING_PEER_DEPENDENCY"] = "MISSING_PEER_DEPENDENCY";
  ErrorCode["QUALIFIED_PATH_RESOLUTION_FAILED"] = "QUALIFIED_PATH_RESOLUTION_FAILED";
  ErrorCode["INTERNAL"] = "INTERNAL";
  ErrorCode["UNDECLARED_DEPENDENCY"] = "UNDECLARED_DEPENDENCY";
  ErrorCode["UNSUPPORTED"] = "UNSUPPORTED";
})(ErrorCode || (ErrorCode = {})); // Some errors are exposed as MODULE_NOT_FOUND for compatibility with packages
// that expect this umbrella error when the resolution fails


const MODULE_NOT_FOUND_ERRORS = new Set([ErrorCode.BLACKLISTED, ErrorCode.BUILTIN_NODE_RESOLUTION_FAILED, ErrorCode.MISSING_DEPENDENCY, ErrorCode.MISSING_PEER_DEPENDENCY, ErrorCode.QUALIFIED_PATH_RESOLUTION_FAILED, ErrorCode.UNDECLARED_DEPENDENCY]);
/**
 * Simple helper function that assign an error code to an error, so that it can more easily be caught and used
 * by third-parties.
 */

function internalTools_makeError(pnpCode, message, data = {}) {
  const code = MODULE_NOT_FOUND_ERRORS.has(pnpCode) ? `MODULE_NOT_FOUND` : pnpCode;
  const propertySpec = {
    configurable: true,
    writable: true,
    enumerable: false
  };
  return Object.defineProperties(new Error(message), {
    code: { ...propertySpec,
      value: code
    },
    pnpCode: { ...propertySpec,
      value: pnpCode
    },
    data: { ...propertySpec,
      value: data
    }
  });
}
/**
 * Returns the module that should be used to resolve require calls. It's usually the direct parent, except if we're
 * inside an eval expression.
 */

function getIssuerModule(parent) {
  let issuer = parent;

  while (issuer && (issuer.id === `[eval]` || issuer.id === `<repl>` || !issuer.filename)) issuer = issuer.parent;

  return issuer || null;
}
// CONCATENATED MODULE: ./sources/loader/applyPatch.ts





function applyPatch(pnpapi, opts) {
  // @ts-ignore
  const builtinModules = new Set(external_module_.Module.builtinModules || Object.keys(process.binding(`natives`)));
  /**
   * The cache that will be used for all accesses occuring outside of a PnP context.
   */

  const defaultCache = {};
  /**
   * Used to disable the resolution hooks (for when we want to fallback to the previous resolution - we then need
   * a way to "reset" the environment temporarily)
   */

  let enableNativeHooks = true; // @ts-ignore

  process.versions.pnp = String(pnpapi.VERSIONS.std); // @ts-ignore

  const moduleExports = __webpack_require__(282); // @ts-ignore


  moduleExports.findPnpApi = lookupSource => {
    const lookupPath = lookupSource instanceof external_url_.URL ? (0,external_url_.fileURLToPath)(lookupSource) : lookupSource;
    const apiPath = opts.manager.findApiPathFor(lookupPath);
    if (apiPath === null) return null;
    const apiEntry = opts.manager.getApiEntry(apiPath, true);
    return apiEntry.instance;
  };

  function getRequireStack(parent) {
    const requireStack = [];

    for (let cursor = parent; cursor; cursor = cursor.parent) requireStack.push(cursor.filename || cursor.id);

    return requireStack;
  } // A small note: we don't replace the cache here (and instead use the native one). This is an effort to not
  // break code similar to "delete require.cache[require.resolve(FOO)]", where FOO is a package located outside
  // of the Yarn dependency tree. In this case, we defer the load to the native loader. If we were to replace the
  // cache by our own, the native loader would populate its own cache, which wouldn't be exposed anymore, so the
  // delete call would be broken.


  const originalModuleLoad = external_module_.Module._load;

  external_module_.Module._load = function (request, parent, isMain) {
    if (!enableNativeHooks) return originalModuleLoad.call(external_module_.Module, request, parent, isMain); // Builtins are managed by the regular Node loader

    if (builtinModules.has(request)) {
      try {
        enableNativeHooks = false;
        return originalModuleLoad.call(external_module_.Module, request, parent, isMain);
      } finally {
        enableNativeHooks = true;
      }
    }

    const parentApiPath = opts.manager.getApiPathFromParent(parent);
    const parentApi = parentApiPath !== null ? opts.manager.getApiEntry(parentApiPath, true).instance : null; // Requests that aren't covered by the PnP runtime goes through the
    // parent `_load` implementation. This is required for VSCode, for example,
    // which override `_load` to provide additional builtins to its extensions.

    if (parentApi === null) return originalModuleLoad(request, parent, isMain); // The 'pnpapi' name is reserved to return the PnP api currently in use
    // by the program

    if (request === `pnpapi`) return parentApi; // Request `Module._resolveFilename` (ie. `resolveRequest`) to tell us
    // which file we should load

    const modulePath = external_module_.Module._resolveFilename(request, parent, isMain); // We check whether the module is owned by the dependency tree of the
    // module that required it. If it isn't, then we need to create a new
    // store and possibly load its sandboxed PnP runtime.


    const isOwnedByRuntime = parentApi !== null ? parentApi.findPackageLocator(modulePath) !== null : false;
    const moduleApiPath = isOwnedByRuntime ? parentApiPath : opts.manager.findApiPathFor(sources_path/* npath.dirname */.cS.dirname(modulePath));
    const entry = moduleApiPath !== null ? opts.manager.getApiEntry(moduleApiPath) : {
      instance: null,
      cache: defaultCache
    }; // Check if the module has already been created for the given file

    const cacheEntry = entry.cache[modulePath];
    if (cacheEntry) return cacheEntry.exports; // Create a new module and store it into the cache
    // @ts-ignore

    const module = new external_module_.Module(modulePath, parent); // @ts-ignore

    module.pnpApiPath = moduleApiPath;
    entry.cache[modulePath] = module; // The main module is exposed as global variable

    if (isMain) {
      // @ts-ignore
      process.mainModule = module;
      module.id = `.`;
    } // Try to load the module, and remove it from the cache if it fails


    let hasThrown = true;

    try {
      // @ts-ignore
      module.load(modulePath);
      hasThrown = false;
    } finally {
      if (hasThrown) {
        delete external_module_.Module._cache[modulePath];
      }
    }

    return module.exports;
  };

  function getIssuerSpecsFromPaths(paths) {
    return paths.map(path => ({
      apiPath: opts.manager.findApiPathFor(path),
      path,
      module: null
    }));
  }

  function getIssuerSpecsFromModule(module) {
    const issuer = getIssuerModule(module);
    const issuerPath = issuer !== null ? sources_path/* npath.dirname */.cS.dirname(issuer.filename) : process.cwd();
    return [{
      apiPath: opts.manager.getApiPathFromParent(issuer),
      path: issuerPath,
      module
    }];
  }

  function makeFakeParent(path) {
    const fakeParent = new external_module_.Module(``);
    const fakeFilePath = sources_path/* npath.join */.cS.join(path, `[file]`);
    fakeParent.paths = external_module_.Module._nodeModulePaths(fakeFilePath);
    return fakeParent;
  } // Splits a require request into its components, or return null if the request is a file path


  const pathRegExp = /^(?![a-zA-Z]:[\\/]|\\\\|\.{0,2}(?:\/|$))((?:@[^/]+\/)?[^/]+)\/*(.*|)$/;
  const originalModuleResolveFilename = external_module_.Module._resolveFilename;

  external_module_.Module._resolveFilename = function (request, parent, isMain, options) {
    if (builtinModules.has(request)) return request;
    if (!enableNativeHooks) return originalModuleResolveFilename.call(external_module_.Module, request, parent, isMain, options);

    if (options && options.plugnplay === false) {
      const {
        plugnplay,
        ...rest
      } = options; // Workaround a bug present in some version of Node (now fixed)
      // https://github.com/nodejs/node/pull/28078

      const forwardedOptions = Object.keys(rest).length > 0 ? rest : undefined;

      try {
        enableNativeHooks = false;
        return originalModuleResolveFilename.call(external_module_.Module, request, parent, isMain, forwardedOptions);
      } finally {
        enableNativeHooks = true;
      }
    } // We check that all the options present here are supported; better
    // to fail fast than to introduce subtle bugs in the runtime.


    if (options) {
      const optionNames = new Set(Object.keys(options));
      optionNames.delete(`paths`);
      optionNames.delete(`plugnplay`);

      if (optionNames.size > 0) {
        throw internalTools_makeError(ErrorCode.UNSUPPORTED, `Some options passed to require() aren't supported by PnP yet (${Array.from(optionNames).join(`, `)})`);
      }
    }

    const issuerSpecs = options && options.paths ? getIssuerSpecsFromPaths(options.paths) : getIssuerSpecsFromModule(parent);

    if (request.match(pathRegExp) === null) {
      const parentDirectory = (parent === null || parent === void 0 ? void 0 : parent.filename) != null ? sources_path/* npath.dirname */.cS.dirname(parent.filename) : null;
      const absoluteRequest = sources_path/* npath.isAbsolute */.cS.isAbsolute(request) ? request : parentDirectory !== null ? sources_path/* npath.resolve */.cS.resolve(parentDirectory, request) : null;

      if (absoluteRequest !== null) {
        const apiPath = parentDirectory === sources_path/* npath.dirname */.cS.dirname(absoluteRequest) && (parent === null || parent === void 0 ? void 0 : parent.pnpApiPath) ? parent.pnpApiPath : opts.manager.findApiPathFor(absoluteRequest);

        if (apiPath !== null) {
          issuerSpecs.unshift({
            apiPath,
            path: parentDirectory,
            module: null
          });
        }
      }
    }

    let firstError;

    for (const {
      apiPath,
      path,
      module
    } of issuerSpecs) {
      let resolution;
      const issuerApi = apiPath !== null ? opts.manager.getApiEntry(apiPath, true).instance : null;

      try {
        if (issuerApi !== null) {
          resolution = issuerApi.resolveRequest(request, path !== null ? `${path}/` : null);
        } else {
          if (path === null) throw new Error(`Assertion failed: Expected the path to be set`);
          resolution = originalModuleResolveFilename.call(external_module_.Module, request, module || makeFakeParent(path), isMain);
        }
      } catch (error) {
        firstError = firstError || error;
        continue;
      }

      if (resolution !== null) {
        return resolution;
      }
    }

    const requireStack = getRequireStack(parent);
    Object.defineProperty(firstError, `requireStack`, {
      configurable: true,
      writable: true,
      enumerable: false,
      value: requireStack
    });
    if (requireStack.length > 0) firstError.message += `\nRequire stack:\n- ${requireStack.join(`\n- `)}`;
    throw firstError;
  };

  const originalFindPath = external_module_.Module._findPath;

  external_module_.Module._findPath = function (request, paths, isMain) {
    if (request === `pnpapi`) return false;
    if (!enableNativeHooks) return originalFindPath.call(external_module_.Module, request, paths, isMain);

    for (const path of paths || []) {
      let resolution;

      try {
        const pnpApiPath = opts.manager.findApiPathFor(path);

        if (pnpApiPath !== null) {
          const api = opts.manager.getApiEntry(pnpApiPath, true).instance;
          resolution = api.resolveRequest(request, path) || false;
        } else {
          resolution = originalFindPath.call(external_module_.Module, request, [path], isMain);
        }
      } catch (error) {
        continue;
      }

      if (resolution) {
        return resolution;
      }
    }

    return false;
  };

  patchFs((external_fs_default()), new PosixFS(opts.fakeFs));
}
// CONCATENATED MODULE: ./sources/loader/hydrateRuntimeState.ts

function hydrateRuntimeState(data, {
  basePath
}) {
  const portablePath = sources_path/* npath.toPortablePath */.cS.toPortablePath(basePath);
  const ignorePattern = data.ignorePatternData !== null ? new RegExp(data.ignorePatternData) : null;
  const packageRegistry = new Map(data.packageRegistryData.map(([packageName, packageStoreData]) => {
    return [packageName, new Map(packageStoreData.map(([packageReference, packageInformationData]) => {
      return [packageReference, {
        packageLocation: sources_path/* ppath.resolve */.y1.resolve(portablePath, packageInformationData.packageLocation),
        packageDependencies: new Map(packageInformationData.packageDependencies),
        packagePeers: new Set(packageInformationData.packagePeers),
        linkType: packageInformationData.linkType,
        discardFromLookup: packageInformationData.discardFromLookup || false
      }];
    }))];
  }));
  const packageLocatorsByLocations = new Map();
  const packageLocationLengths = new Set();

  for (const [packageName, storeData] of data.packageRegistryData) {
    for (const [packageReference, packageInformationData] of storeData) {
      if (packageName === null !== (packageReference === null)) throw new Error(`Assertion failed: The name and reference should be null, or neither should`);
      if (packageInformationData.discardFromLookup) continue; // @ts-ignore: TypeScript isn't smart enough to understand the type assertion

      const packageLocator = {
        name: packageName,
        reference: packageReference
      };
      packageLocatorsByLocations.set(packageInformationData.packageLocation, packageLocator);
      packageLocationLengths.add(packageInformationData.packageLocation.length);
    }
  }

  for (const location of data.locationBlacklistData) packageLocatorsByLocations.set(location, null);

  const fallbackExclusionList = new Map(data.fallbackExclusionList.map(([packageName, packageReferences]) => {
    return [packageName, new Set(packageReferences)];
  }));
  const fallbackPool = new Map(data.fallbackPool);
  const dependencyTreeRoots = data.dependencyTreeRoots;
  const enableTopLevelFallback = data.enableTopLevelFallback;
  return {
    basePath: portablePath,
    dependencyTreeRoots,
    enableTopLevelFallback,
    fallbackExclusionList,
    fallbackPool,
    ignorePattern,
    packageLocationLengths: [...packageLocationLengths].sort((a, b) => b - a),
    packageLocatorsByLocations,
    packageRegistry
  };
}
// CONCATENATED MODULE: ./sources/loader/makeApi.ts




function makeApi(runtimeState, opts) {
  const alwaysWarnOnFallback = Number(process.env.PNP_ALWAYS_WARN_ON_FALLBACK) > 0;
  const debugLevel = Number(process.env.PNP_DEBUG_LEVEL); // @ts-ignore

  const builtinModules = new Set(external_module_.Module.builtinModules || Object.keys(process.binding(`natives`))); // Splits a require request into its components, or return null if the request is a file path

  const pathRegExp = /^(?![a-zA-Z]:[\\/]|\\\\|\.{0,2}(?:\/|$))((?:@[^/]+\/)?[^/]+)\/*(.*|)$/; // Matches if the path starts with a valid path qualifier (./, ../, /)
  // eslint-disable-next-line no-unused-vars

  const isStrictRegExp = /^\.{0,2}\//; // Matches if the path must point to a directory (ie ends with /)

  const isDirRegExp = /\/$/; // We only instantiate one of those so that we can use strict-equal comparisons

  const topLevelLocator = {
    name: null,
    reference: null
  }; // Used for compatibility purposes - cf setupCompatibilityLayer

  const fallbackLocators = []; // To avoid emitting the same warning multiple times

  const emittedWarnings = new Set();

  if (opts.compatibilityMode !== false) {
    // ESLint currently doesn't have any portable way for shared configs to
    // specify their own plugins that should be used (cf issue #10125). This
    // will likely get fixed at some point but it'll take time, so in the
    // meantime we'll just add additional fallback entries for common shared
    // configs.
    // Similarly, Gatsby generates files within the `public` folder located
    // within the project, but doesn't pre-resolve the `require` calls to use
    // its own dependencies. Meaning that when PnP see a file from the `public`
    // folder making a require, it thinks that your project forgot to list one
    // of your dependencies.
    for (const name of [`react-scripts`, `gatsby`]) {
      const packageStore = runtimeState.packageRegistry.get(name);

      if (packageStore) {
        for (const reference of packageStore.keys()) {
          if (reference === null) {
            throw new Error(`Assertion failed: This reference shouldn't be null`);
          } else {
            fallbackLocators.push({
              name,
              reference
            });
          }
        }
      }
    }
  }
  /**
   * The setup code will be injected here. The tables listed below are guaranteed to be filled after the call to
   * the $$DYNAMICALLY_GENERATED_CODE function.
   */


  const {
    ignorePattern,
    packageRegistry,
    packageLocatorsByLocations,
    packageLocationLengths
  } = runtimeState;
  /**
   * Allows to print useful logs just be setting a value in the environment
   */

  function makeLogEntry(name, args) {
    return {
      fn: name,
      args,
      error: null,
      result: null
    };
  }

  function maybeLog(name, fn) {
    if (opts.allowDebug === false) return fn;

    if (Number.isFinite(debugLevel)) {
      if (debugLevel >= 2) {
        return (...args) => {
          const logEntry = makeLogEntry(name, args);

          try {
            return logEntry.result = fn(...args);
          } catch (error) {
            throw logEntry.error = error;
          } finally {
            console.trace(logEntry);
          }
        };
      } else if (debugLevel >= 1) {
        return (...args) => {
          try {
            return fn(...args);
          } catch (error) {
            const logEntry = makeLogEntry(name, args);
            logEntry.error = error;
            console.trace(logEntry);
            throw error;
          }
        };
      }
    }

    return fn;
  }
  /**
   * Returns information about a package in a safe way (will throw if they cannot be retrieved)
   */


  function getPackageInformationSafe(packageLocator) {
    const packageInformation = getPackageInformation(packageLocator);

    if (!packageInformation) {
      throw internalTools_makeError(ErrorCode.INTERNAL, `Couldn't find a matching entry in the dependency tree for the specified parent (this is probably an internal error)`);
    }

    return packageInformation;
  }
  /**
   * Returns whether the specified locator is a dependency tree root (in which case it's part of the project) or not
   */


  function isDependencyTreeRoot(packageLocator) {
    if (packageLocator.name === null) return true;

    for (const dependencyTreeRoot of runtimeState.dependencyTreeRoots) if (dependencyTreeRoot.name === packageLocator.name && dependencyTreeRoot.reference === packageLocator.reference) return true;

    return false;
  }
  /**
   * Implements the node resolution for folder access and extension selection
   */


  function applyNodeExtensionResolution(unqualifiedPath, candidates, {
    extensions
  }) {
    let stat;

    try {
      candidates.push(unqualifiedPath);
      stat = opts.fakeFs.statSync(unqualifiedPath);
    } catch (error) {} // If the file exists and is a file, we can stop right there


    if (stat && !stat.isDirectory()) return opts.fakeFs.realpathSync(unqualifiedPath); // If the file is a directory, we must check if it contains a package.json with a "main" entry

    if (stat && stat.isDirectory()) {
      let pkgJson;

      try {
        pkgJson = JSON.parse(opts.fakeFs.readFileSync(sources_path/* ppath.join */.y1.join(unqualifiedPath, `package.json`), `utf8`));
      } catch (error) {}

      let nextUnqualifiedPath;
      if (pkgJson && pkgJson.main) nextUnqualifiedPath = sources_path/* ppath.resolve */.y1.resolve(unqualifiedPath, pkgJson.main); // If the "main" field changed the path, we start again from this new location

      if (nextUnqualifiedPath && nextUnqualifiedPath !== unqualifiedPath) {
        const resolution = applyNodeExtensionResolution(nextUnqualifiedPath, candidates, {
          extensions
        });

        if (resolution !== null) {
          return resolution;
        }
      }
    } // Otherwise we check if we find a file that match one of the supported extensions


    for (let i = 0, length = extensions.length; i < length; i++) {
      const candidateFile = `${unqualifiedPath}${extensions[i]}`;
      candidates.push(candidateFile);

      if (opts.fakeFs.existsSync(candidateFile)) {
        return candidateFile;
      }
    } // Otherwise, we check if the path is a folder - in such a case, we try to use its index


    if (stat && stat.isDirectory()) {
      for (let i = 0, length = extensions.length; i < length; i++) {
        const candidateFile = sources_path/* ppath.format */.y1.format({
          dir: unqualifiedPath,
          name: `index`,
          ext: extensions[i]
        });
        candidates.push(candidateFile);

        if (opts.fakeFs.existsSync(candidateFile)) {
          return candidateFile;
        }
      }
    } // Otherwise there's nothing else we can do :(


    return null;
  }
  /**
   * This function creates fake modules that can be used with the _resolveFilename function.
   * Ideally it would be nice to be able to avoid this, since it causes useless allocations
   * and cannot be cached efficiently (we recompute the nodeModulePaths every time).
   *
   * Fortunately, this should only affect the fallback, and there hopefully shouldn't have a
   * lot of them.
   */


  function makeFakeModule(path) {
    // @ts-ignore
    const fakeModule = new external_module_.Module(path, null);
    fakeModule.filename = path;
    fakeModule.paths = external_module_.Module._nodeModulePaths(path);
    return fakeModule;
  }
  /**
   * Normalize path to posix format.
   */


  function normalizePath(p) {
    return sources_path/* npath.toPortablePath */.cS.toPortablePath(p);
  }
  /**
   * Forward the resolution to the next resolver (usually the native one)
   */


  function callNativeResolution(request, issuer) {
    if (issuer.endsWith(`/`)) issuer = sources_path/* ppath.join */.y1.join(issuer, `internal.js`); // Since we would need to create a fake module anyway (to call _resolveLookupPath that
    // would give us the paths to give to _resolveFilename), we can as well not use
    // the {paths} option at all, since it internally makes _resolveFilename create another
    // fake module anyway.

    return external_module_.Module._resolveFilename(request, makeFakeModule(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(issuer)), false, {
      plugnplay: false
    });
  }
  /**
   *
   */


  function isPathIgnored(path) {
    if (ignorePattern === null) return false;
    const subPath = sources_path/* ppath.contains */.y1.contains(runtimeState.basePath, path);
    if (subPath === null) return false;

    if (ignorePattern.test(subPath.replace(/\/$/, ``))) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * This key indicates which version of the standard is implemented by this resolver. The `std` key is the
   * Plug'n'Play standard, and any other key are third-party extensions. Third-party extensions are not allowed
   * to override the standard, and can only offer new methods.
   *
   * If a new version of the Plug'n'Play standard is released and some extensions conflict with newly added
   * functions, they'll just have to fix the conflicts and bump their own version number.
   */


  const VERSIONS = {
    std: 3,
    resolveVirtual: 1
  };
  /**
   * We export a special symbol for easy access to the top level locator.
   */

  const topLevel = topLevelLocator;
  /**
   * Gets the package information for a given locator. Returns null if they cannot be retrieved.
   */

  function getPackageInformation({
    name,
    reference
  }) {
    const packageInformationStore = packageRegistry.get(name);
    if (!packageInformationStore) return null;
    const packageInformation = packageInformationStore.get(reference);
    if (!packageInformation) return null;
    return packageInformation;
  }
  /**
   * Find all packages that depend on the specified one.
   *
   * Note: This is a private function; we expect consumers to implement it
   * themselves. We keep it that way because this implementation isn't
   * optimized at all, since we only need it when printing errors.
   */


  function findPackageDependents({
    name,
    reference
  }) {
    const dependents = [];

    for (const [dependentName, packageInformationStore] of packageRegistry) {
      if (dependentName === null) continue;

      for (const [dependentReference, packageInformation] of packageInformationStore) {
        if (dependentReference === null) continue;
        const dependencyReference = packageInformation.packageDependencies.get(name);
        if (dependencyReference !== reference) continue; // Don't forget that all packages depend on themselves

        if (dependentName === name && dependentReference === reference) continue;
        dependents.push({
          name: dependentName,
          reference: dependentReference
        });
      }
    }

    return dependents;
  }
  /**
   * Find all packages that broke the peer dependency on X, starting from Y.
   *
   * Note: This is a private function; we expect consumers to implement it
   * themselves. We keep it that way because this implementation isn't
   * optimized at all, since we only need it when printing errors.
   */


  function findBrokenPeerDependencies(dependency, initialPackage) {
    const brokenPackages = new Map();
    const alreadyVisited = new Set();

    const traversal = currentPackage => {
      const identifier = JSON.stringify(currentPackage.name);
      if (alreadyVisited.has(identifier)) return;
      alreadyVisited.add(identifier);
      const dependents = findPackageDependents(currentPackage);

      for (const dependent of dependents) {
        const dependentInformation = getPackageInformationSafe(dependent);

        if (dependentInformation.packagePeers.has(dependency)) {
          traversal(dependent);
        } else {
          let brokenSet = brokenPackages.get(dependent.name);
          if (typeof brokenSet === `undefined`) brokenPackages.set(dependent.name, brokenSet = new Set());
          brokenSet.add(dependent.reference);
        }
      }
    };

    traversal(initialPackage);
    const brokenList = [];

    for (const name of [...brokenPackages.keys()].sort()) for (const reference of [...brokenPackages.get(name)].sort()) brokenList.push({
      name,
      reference
    });

    return brokenList;
  }
  /**
   * Finds the package locator that owns the specified path. If none is found, returns null instead.
   */


  function findPackageLocator(location) {
    let relativeLocation = normalizePath(sources_path/* ppath.relative */.y1.relative(runtimeState.basePath, location));
    if (!relativeLocation.match(isStrictRegExp)) relativeLocation = `./${relativeLocation}`;
    if (location.match(isDirRegExp) && !relativeLocation.endsWith(`/`)) relativeLocation = `${relativeLocation}/`;
    let from = 0; // If someone wants to use a binary search to go from O(n) to O(log n), be my guest

    while (from < packageLocationLengths.length && packageLocationLengths[from] > relativeLocation.length) from += 1;

    for (let t = from; t < packageLocationLengths.length; ++t) {
      const locator = packageLocatorsByLocations.get(relativeLocation.substr(0, packageLocationLengths[t]));
      if (typeof locator === `undefined`) continue; // Ensures that the returned locator isn't a blacklisted one.
      //
      // Blacklisted packages are packages that cannot be used because their dependencies cannot be deduced. This only
      // happens with peer dependencies, which effectively have different sets of dependencies depending on their
      // parents.
      //
      // In order to deambiguate those different sets of dependencies, the Yarn implementation of PnP will generate a
      // symlink for each combination of <package name>/<package version>/<dependent package> it will find, and will
      // blacklist the target of those symlinks. By doing this, we ensure that files loaded through a specific path
      // will always have the same set of dependencies, provided the symlinks are correctly preserved.
      //
      // Unfortunately, some tools do not preserve them, and when it happens PnP isn't able anymore to deduce the set of
      // dependencies based on the path of the file that makes the require calls. But since we've blacklisted those
      // paths, we're able to print a more helpful error message that points out that a third-party package is doing
      // something incompatible!

      if (locator === null) {
        throw internalTools_makeError(ErrorCode.BLACKLISTED, `A forbidden path has been used in the package resolution process - this is usually caused by one of your tools calling 'fs.realpath' on the return value of 'require.resolve'. Since we need to use symlinks to simultaneously provide valid filesystem paths and disambiguate peer dependencies, they must be passed untransformed to 'require'.\n\nForbidden path: ${location}`, {
          location
        });
      }

      return locator;
    }

    return null;
  }
  /**
   * Transforms a request (what's typically passed as argument to the require function) into an unqualified path.
   * This path is called "unqualified" because it only changes the package name to the package location on the disk,
   * which means that the end result still cannot be directly accessed (for example, it doesn't try to resolve the
   * file extension, or to resolve directories to their "index.js" content). Use the "resolveUnqualified" function
   * to convert them to fully-qualified paths, or just use "resolveRequest" that do both operations in one go.
   *
   * Note that it is extremely important that the `issuer` path ends with a forward slash if the issuer is to be
   * treated as a folder (ie. "/tmp/foo/" rather than "/tmp/foo" if "foo" is a directory). Otherwise relative
   * imports won't be computed correctly (they'll get resolved relative to "/tmp/" instead of "/tmp/foo/").
   */


  function resolveToUnqualified(request, issuer, {
    considerBuiltins = true
  } = {}) {
    // The 'pnpapi' request is reserved and will always return the path to the PnP file, from everywhere
    if (request === `pnpapi`) return sources_path/* npath.toPortablePath */.cS.toPortablePath(opts.pnpapiResolution); // Bailout if the request is a native module

    if (considerBuiltins && builtinModules.has(request)) return null; // We allow disabling the pnp resolution for some subpaths.
    // This is because some projects, often legacy, contain multiple
    // levels of dependencies (ie. a yarn.lock inside a subfolder of
    // a yarn.lock). This is typically solved using workspaces, but
    // not all of them have been converted already.

    if (issuer && isPathIgnored(issuer)) {
      // Absolute paths that seem to belong to a PnP tree are still
      // handled by our runtime even if the issuer isn't. This is
      // because the native Node resolution uses a special version
      // of the `stat` syscall which would otherwise bypass the
      // filesystem layer we require to access the files.
      if (!sources_path/* ppath.isAbsolute */.y1.isAbsolute(request) || findPackageLocator(request) === null) {
        const result = callNativeResolution(request, issuer);

        if (result === false) {
          throw internalTools_makeError(ErrorCode.BUILTIN_NODE_RESOLUTION_FAILED, `The builtin node resolution algorithm was unable to resolve the requested module (it didn't go through the pnp resolver because the issuer was explicitely ignored by the regexp)\n\nRequire request: "${request}"\nRequired by: ${issuer}\n`, {
            request,
            issuer
          });
        }

        return sources_path/* npath.toPortablePath */.cS.toPortablePath(result);
      }
    }

    let unqualifiedPath; // If the request is a relative or absolute path, we just return it normalized

    const dependencyNameMatch = request.match(pathRegExp);

    if (!dependencyNameMatch) {
      if (sources_path/* ppath.isAbsolute */.y1.isAbsolute(request)) {
        unqualifiedPath = sources_path/* ppath.normalize */.y1.normalize(request);
      } else {
        if (!issuer) {
          throw internalTools_makeError(ErrorCode.API_ERROR, `The resolveToUnqualified function must be called with a valid issuer when the path isn't a builtin nor absolute`, {
            request,
            issuer
          });
        } // We use ppath.join instead of ppath.resolve because:
        // 1) The request is a relative path in this branch
        // 2) ppath.join preserves trailing slashes


        const absoluteIssuer = sources_path/* ppath.resolve */.y1.resolve(issuer);

        if (issuer.match(isDirRegExp)) {
          unqualifiedPath = sources_path/* ppath.normalize */.y1.normalize(sources_path/* ppath.join */.y1.join(absoluteIssuer, request));
        } else {
          unqualifiedPath = sources_path/* ppath.normalize */.y1.normalize(sources_path/* ppath.join */.y1.join(sources_path/* ppath.dirname */.y1.dirname(absoluteIssuer), request));
        }
      } // No need to use the return value; we just want to check the blacklist status


      findPackageLocator(unqualifiedPath);
    } // Things are more hairy if it's a package require - we then need to figure out which package is needed, and in
    // particular the exact version for the given location on the dependency tree
    else {
        if (!issuer) {
          throw internalTools_makeError(ErrorCode.API_ERROR, `The resolveToUnqualified function must be called with a valid issuer when the path isn't a builtin nor absolute`, {
            request,
            issuer
          });
        }

        const [, dependencyName, subPath] = dependencyNameMatch;
        const issuerLocator = findPackageLocator(issuer); // If the issuer file doesn't seem to be owned by a package managed through pnp, then we resort to using the next
        // resolution algorithm in the chain, usually the native Node resolution one

        if (!issuerLocator) {
          const result = callNativeResolution(request, issuer);

          if (result === false) {
            throw internalTools_makeError(ErrorCode.BUILTIN_NODE_RESOLUTION_FAILED, `The builtin node resolution algorithm was unable to resolve the requested module (it didn't go through the pnp resolver because the issuer doesn't seem to be part of the Yarn-managed dependency tree).\n\nRequire path: "${request}"\nRequired by: ${issuer}\n`, {
              request,
              issuer
            });
          }

          return sources_path/* npath.toPortablePath */.cS.toPortablePath(result);
        }

        const issuerInformation = getPackageInformationSafe(issuerLocator); // We obtain the dependency reference in regard to the package that request it

        let dependencyReference = issuerInformation.packageDependencies.get(dependencyName);
        let fallbackReference = null; // If we can't find it, we check if we can potentially load it from the packages that have been defined as potential fallbacks.
        // It's a bit of a hack, but it improves compatibility with the existing Node ecosystem. Hopefully we should eventually be able
        // to kill this logic and become stricter once pnp gets enough traction and the affected packages fix themselves.

        if (dependencyReference == null) {
          if (issuerLocator.name !== null) {
            // To allow programs to become gradually stricter, starting from the v2 we enforce that workspaces cannot depend on fallbacks.
            // This works by having a list containing all their locators, and checking when a fallback is required whether it's one of them.
            const exclusionEntry = runtimeState.fallbackExclusionList.get(issuerLocator.name);
            const canUseFallbacks = !exclusionEntry || !exclusionEntry.has(issuerLocator.reference);

            if (canUseFallbacks) {
              for (let t = 0, T = fallbackLocators.length; t < T; ++t) {
                const fallbackInformation = getPackageInformationSafe(fallbackLocators[t]);
                const reference = fallbackInformation.packageDependencies.get(dependencyName);
                if (reference == null) continue;
                if (alwaysWarnOnFallback) fallbackReference = reference;else dependencyReference = reference;
                break;
              }

              if (runtimeState.enableTopLevelFallback) {
                if (dependencyReference == null && fallbackReference === null) {
                  const reference = runtimeState.fallbackPool.get(dependencyName);

                  if (reference != null) {
                    fallbackReference = reference;
                  }
                }
              }
            }
          }
        } // If we can't find the path, and if the package making the request is the top-level, we can offer nicer error messages


        let error = null;

        if (dependencyReference === null) {
          if (isDependencyTreeRoot(issuerLocator)) {
            error = internalTools_makeError(ErrorCode.MISSING_PEER_DEPENDENCY, `Your application tried to access ${dependencyName} (a peer dependency); this isn't allowed as there is no ancestor to satisfy the requirement. Use a devDependency if needed.\n\nRequired package: ${dependencyName} (via "${request}")\nRequired by: ${issuer}\n`, {
              request,
              issuer,
              dependencyName
            });
          } else {
            const brokenAncestors = findBrokenPeerDependencies(dependencyName, issuerLocator);

            if (brokenAncestors.every(ancestor => isDependencyTreeRoot(ancestor))) {
              error = internalTools_makeError(ErrorCode.MISSING_PEER_DEPENDENCY, `${issuerLocator.name} tried to access ${dependencyName} (a peer dependency) but it isn't provided by your application; this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${request}")\nRequired by: ${issuerLocator.name}@${issuerLocator.reference} (via ${issuer})\n${brokenAncestors.map(ancestorLocator => `Ancestor breaking the chain: ${ancestorLocator.name}@${ancestorLocator.reference}\n`).join(``)}\n`, {
                request,
                issuer,
                issuerLocator: Object.assign({}, issuerLocator),
                dependencyName,
                brokenAncestors
              });
            } else {
              error = internalTools_makeError(ErrorCode.MISSING_PEER_DEPENDENCY, `${issuerLocator.name} tried to access ${dependencyName} (a peer dependency) but it isn't provided by its ancestors; this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${request}")\nRequired by: ${issuerLocator.name}@${issuerLocator.reference} (via ${issuer})\n${brokenAncestors.map(ancestorLocator => `Ancestor breaking the chain: ${ancestorLocator.name}@${ancestorLocator.reference}\n`).join(``)}\n`, {
                request,
                issuer,
                issuerLocator: Object.assign({}, issuerLocator),
                dependencyName,
                brokenAncestors
              });
            }
          }
        } else if (dependencyReference === undefined) {
          if (isDependencyTreeRoot(issuerLocator)) {
            error = internalTools_makeError(ErrorCode.UNDECLARED_DEPENDENCY, `Your application tried to access ${dependencyName}, but it isn't declared in your dependencies; this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${request}")\nRequired by: ${issuer}\n`, {
              request,
              issuer,
              dependencyName
            });
          } else {
            error = internalTools_makeError(ErrorCode.UNDECLARED_DEPENDENCY, `${issuerLocator.name} tried to access ${dependencyName}, but it isn't declared in its dependencies; this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${request}")\nRequired by: ${issuerLocator.name}@${issuerLocator.reference} (via ${issuer})\n`, {
              request,
              issuer,
              issuerLocator: Object.assign({}, issuerLocator),
              dependencyName
            });
          }
        }

        if (dependencyReference == null) {
          if (fallbackReference === null || error === null) throw error || new Error(`Assertion failed: Expected an error to have been set`);
          dependencyReference = fallbackReference;
          const message = error.message.replace(/\n.*/g, ``);
          error.message = message;

          if (!emittedWarnings.has(message)) {
            emittedWarnings.add(message);
            process.emitWarning(error);
          }
        } // We need to check that the package exists on the filesystem, because it might not have been installed


        const dependencyLocator = Array.isArray(dependencyReference) ? {
          name: dependencyReference[0],
          reference: dependencyReference[1]
        } : {
          name: dependencyName,
          reference: dependencyReference
        };
        const dependencyInformation = getPackageInformationSafe(dependencyLocator);

        if (!dependencyInformation.packageLocation) {
          throw internalTools_makeError(ErrorCode.MISSING_DEPENDENCY, `A dependency seems valid but didn't get installed for some reason. This might be caused by a partial install, such as dev vs prod.\n\nRequired package: ${dependencyLocator.name}@${dependencyLocator.reference} (via "${request}")\nRequired by: ${issuerLocator.name}@${issuerLocator.reference} (via ${issuer})\n`, {
            request,
            issuer,
            dependencyLocator: Object.assign({}, dependencyLocator)
          });
        } // Now that we know which package we should resolve to, we only have to find out the file location


        const dependencyLocation = sources_path/* ppath.resolve */.y1.resolve(runtimeState.basePath, dependencyInformation.packageLocation);

        if (subPath) {
          unqualifiedPath = sources_path/* ppath.resolve */.y1.resolve(dependencyLocation, subPath);
        } else {
          unqualifiedPath = dependencyLocation;
        }
      }

    return sources_path/* ppath.normalize */.y1.normalize(unqualifiedPath);
  }
  /**
   * Transforms an unqualified path into a qualified path by using the Node resolution algorithm (which automatically
   * appends ".js" / ".json", and transforms directory accesses into "index.js").
   */


  function resolveUnqualified(unqualifiedPath, {
    extensions = Object.keys(external_module_.Module._extensions)
  } = {}) {
    const candidates = [];
    const qualifiedPath = applyNodeExtensionResolution(unqualifiedPath, candidates, {
      extensions
    });

    if (qualifiedPath) {
      return sources_path/* ppath.normalize */.y1.normalize(qualifiedPath);
    } else {
      throw internalTools_makeError(ErrorCode.QUALIFIED_PATH_RESOLUTION_FAILED, `Qualified path resolution failed - none of the candidates can be found on the disk.\n\nSource path: ${unqualifiedPath}\n${candidates.map(candidate => `Rejected candidate: ${candidate}\n`).join(``)}`, {
        unqualifiedPath
      });
    }
  }
  /**
   * Transforms a request into a fully qualified path.
   *
   * Note that it is extremely important that the `issuer` path ends with a forward slash if the issuer is to be
   * treated as a folder (ie. "/tmp/foo/" rather than "/tmp/foo" if "foo" is a directory). Otherwise relative
   * imports won't be computed correctly (they'll get resolved relative to "/tmp/" instead of "/tmp/foo/").
   */


  function resolveRequest(request, issuer, {
    considerBuiltins,
    extensions
  } = {}) {
    const unqualifiedPath = resolveToUnqualified(request, issuer, {
      considerBuiltins
    });
    if (unqualifiedPath === null) return null;

    try {
      return resolveUnqualified(unqualifiedPath, {
        extensions
      });
    } catch (resolutionError) {
      if (resolutionError.pnpCode === `QUALIFIED_PATH_RESOLUTION_FAILED`) Object.assign(resolutionError.data, {
        request,
        issuer
      });
      throw resolutionError;
    }
  }

  function resolveVirtual(request) {
    const normalized = sources_path/* ppath.normalize */.y1.normalize(request);
    const resolved = VirtualFS.resolveVirtual(normalized);
    return resolved !== normalized ? resolved : null;
  }

  return {
    VERSIONS,
    topLevel,
    getLocator: (name, referencish) => {
      if (Array.isArray(referencish)) {
        return {
          name: referencish[0],
          reference: referencish[1]
        };
      } else {
        return {
          name,
          reference: referencish
        };
      }
    },
    getDependencyTreeRoots: () => {
      return [...runtimeState.dependencyTreeRoots];
    },
    getPackageInformation: locator => {
      const info = getPackageInformation(locator);
      if (info === null) return null;
      const packageLocation = sources_path/* npath.fromPortablePath */.cS.fromPortablePath(info.packageLocation);
      const nativeInfo = { ...info,
        packageLocation
      };
      return nativeInfo;
    },
    findPackageLocator: path => {
      return findPackageLocator(sources_path/* npath.toPortablePath */.cS.toPortablePath(path));
    },
    resolveToUnqualified: maybeLog(`resolveToUnqualified`, (request, issuer, opts) => {
      const portableIssuer = issuer !== null ? sources_path/* npath.toPortablePath */.cS.toPortablePath(issuer) : null;
      const resolution = resolveToUnqualified(sources_path/* npath.toPortablePath */.cS.toPortablePath(request), portableIssuer, opts);
      if (resolution === null) return null;
      return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(resolution);
    }),
    resolveUnqualified: maybeLog(`resolveUnqualified`, (unqualifiedPath, opts) => {
      return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(resolveUnqualified(sources_path/* npath.toPortablePath */.cS.toPortablePath(unqualifiedPath), opts));
    }),
    resolveRequest: maybeLog(`resolveRequest`, (request, issuer, opts) => {
      const portableIssuer = issuer !== null ? sources_path/* npath.toPortablePath */.cS.toPortablePath(issuer) : null;
      const resolution = resolveRequest(sources_path/* npath.toPortablePath */.cS.toPortablePath(request), portableIssuer, opts);
      if (resolution === null) return null;
      return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(resolution);
    }),
    resolveVirtual: maybeLog(`resolveVirtual`, path => {
      const result = resolveVirtual(sources_path/* npath.toPortablePath */.cS.toPortablePath(path));

      if (result !== null) {
        return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(result);
      } else {
        return null;
      }
    })
  };
}
// CONCATENATED MODULE: ./sources/loader/makeManager.ts


function makeManager(pnpapi, opts) {
  const initialApiPath = sources_path/* npath.toPortablePath */.cS.toPortablePath(pnpapi.resolveToUnqualified(`pnpapi`, null));
  const initialApiStats = opts.fakeFs.statSync(sources_path/* npath.toPortablePath */.cS.toPortablePath(initialApiPath));
  const apiMetadata = new Map([[initialApiPath, {
    cache: external_module_.Module._cache,
    instance: pnpapi,
    stats: initialApiStats
  }]]);

  function loadApiInstance(pnpApiPath) {
    const nativePath = sources_path/* npath.fromPortablePath */.cS.fromPortablePath(pnpApiPath); // @ts-ignore

    const module = new external_module_.Module(nativePath, null); // @ts-ignore

    module.load(nativePath);
    return module.exports;
  }

  function refreshApiEntry(pnpApiPath, apiEntry) {
    const stats = opts.fakeFs.statSync(pnpApiPath);

    if (stats.mtime > apiEntry.stats.mtime) {
      console.warn(`[Warning] The runtime detected new informations in a PnP file; reloading the API instance (${pnpApiPath})`);
      apiEntry.instance = loadApiInstance(pnpApiPath);
      apiEntry.stats = stats;
    }
  }

  function getApiEntry(pnpApiPath, refresh = false) {
    let apiEntry = apiMetadata.get(pnpApiPath);

    if (typeof apiEntry !== `undefined`) {
      if (refresh) {
        refreshApiEntry(pnpApiPath, apiEntry);
      }
    } else {
      apiMetadata.set(pnpApiPath, apiEntry = {
        cache: {},
        instance: loadApiInstance(pnpApiPath),
        stats: opts.fakeFs.statSync(pnpApiPath)
      });
    }

    return apiEntry;
  }

  const findApiPathCache = new Map();

  function addToCache(start, end, target) {
    let curr;
    let next = start;

    do {
      curr = next;
      findApiPathCache.set(curr, target);
      next = sources_path/* ppath.dirname */.y1.dirname(curr);
    } while (curr !== end);
  }

  function findApiPathFor(modulePath) {
    const start = VirtualFS.resolveVirtual(sources_path/* ppath.resolve */.y1.resolve(sources_path/* npath.toPortablePath */.cS.toPortablePath(modulePath)));
    let curr;
    let next = start;

    do {
      curr = next;
      const cached = findApiPathCache.get(curr);

      if (cached !== undefined) {
        addToCache(start, curr, cached);
        return cached;
      }

      const candidate = sources_path/* ppath.join */.y1.join(curr, `.pnp.js`);

      if (xfs.existsSync(candidate) && xfs.statSync(candidate).isFile()) {
        addToCache(start, curr, candidate);
        return candidate;
      }

      const cjsCandidate = sources_path/* ppath.join */.y1.join(curr, `.pnp.cjs`);

      if (xfs.existsSync(cjsCandidate) && xfs.statSync(cjsCandidate).isFile()) {
        addToCache(start, curr, cjsCandidate);
        return cjsCandidate;
      }

      next = sources_path/* ppath.dirname */.y1.dirname(curr);
    } while (curr !== sources_path/* PortablePath.root */.LZ.root);

    addToCache(start, curr, null);
    return null;
  }

  function getApiPathFromParent(parent) {
    if (parent == null) return initialApiPath;

    if (typeof parent.pnpApiPath === `undefined`) {
      if (parent.filename !== null) {
        return parent.pnpApiPath = findApiPathFor(parent.filename);
      } else {
        return initialApiPath;
      }
    }

    if (parent.pnpApiPath !== null) return parent.pnpApiPath;
    return null;
  }

  return {
    getApiPathFromParent,
    findApiPathFor,
    getApiEntry
  };
}
// CONCATENATED MODULE: ./sources/loader/_entryPoint.ts








 // We must copy the fs into a local, because otherwise
// 1. we would make the NodeFS instance use the function that we patched (infinite loop)
// 2. Object.create(fs) isn't enough, since it won't prevent the proto from being modified

const localFs = { ...(external_fs_default())
};
const nodeFs = new NodeFS(localFs);
const defaultRuntimeState = $$SETUP_STATE(hydrateRuntimeState);
const defaultPnpapiResolution = __filename; // We create a virtual filesystem that will do three things:
// 1. all requests inside a folder named "$$virtual" will be remapped according the virtual folder rules
// 2. all requests going inside a Zip archive will be handled by the Zip fs implementation
// 3. any remaining request will be forwarded to Node as-is

const defaultFsLayer = new VirtualFS({
  baseFs: new ZipOpenFS({
    baseFs: nodeFs,
    libzip: getLibzipSync(),
    maxOpenFiles: 80,
    readOnlyArchives: true
  })
});
let manager;
const defaultApi = Object.assign(makeApi(defaultRuntimeState, {
  fakeFs: defaultFsLayer,
  pnpapiResolution: defaultPnpapiResolution
}), {
  /**
   * Can be used to generate a different API than the default one (for example
   * to map it on `/` rather than the local directory path, or to use a
   * different FS layer than the default one).
   */
  makeApi: ({
    basePath = undefined,
    fakeFs = defaultFsLayer,
    pnpapiResolution = defaultPnpapiResolution,
    ...rest
  }) => {
    const apiRuntimeState = typeof basePath !== `undefined` ? $$SETUP_STATE(hydrateRuntimeState, basePath) : defaultRuntimeState;
    return makeApi(apiRuntimeState, {
      fakeFs,
      pnpapiResolution,
      ...rest
    });
  },

  /**
   * Will inject the specified API into the environment, monkey-patching FS. Is
   * automatically called when the hook is loaded through `--require`.
   */
  setup: api => {
    applyPatch(api || defaultApi, {
      fakeFs: defaultFsLayer,
      manager
    });
  }
});
manager = makeManager(defaultApi, {
  fakeFs: defaultFsLayer
}); // eslint-disable-next-line arca/no-default-export

/* harmony default export */ const _entryPoint = (defaultApi);

if (__non_webpack_module__.parent && __non_webpack_module__.parent.id === `internal/preload`) {
  defaultApi.setup();

  if (__non_webpack_module__.filename) {
    // We delete it from the cache in order to support the case where the CLI resolver is invoked from "yarn run"
    // It's annoying because it might cause some issues when the file is multiple times in NODE_OPTIONS, but it shouldn't happen anyway.
    // @ts-ignore
    delete (external_module_default())._cache[__non_webpack_module__.filename];
  }
} // @ts-ignore


if (process.mainModule === __non_webpack_module__) {
  const reportError = (code, message, data) => {
    process.stdout.write(`${JSON.stringify([{
      code,
      message,
      data
    }, null])}\n`);
  };

  const reportSuccess = resolution => {
    process.stdout.write(`${JSON.stringify([null, resolution])}\n`);
  };

  const processResolution = (request, issuer) => {
    try {
      reportSuccess(defaultApi.resolveRequest(request, issuer));
    } catch (error) {
      reportError(error.code, error.message, error.data);
    }
  };

  const processRequest = data => {
    try {
      const [request, issuer] = JSON.parse(data);
      processResolution(request, issuer);
    } catch (error) {
      reportError(`INVALID_JSON`, error.message, error.data);
    }
  };

  if (process.argv.length > 2) {
    if (process.argv.length !== 4) {
      process.stderr.write(`Usage: ${process.argv[0]} ${process.argv[1]} <request> <issuer>\n`);
      process.exitCode = 64;
      /* EX_USAGE */
    } else {
      processResolution(process.argv[2], process.argv[3]);
    }
  } else {
    let buffer = ``;
    const decoder = new (external_string_decoder_default()).StringDecoder();
    process.stdin.on(`data`, chunk => {
      buffer += decoder.write(chunk);

      do {
        const index = buffer.indexOf(`\n`);
        if (index === -1) break;
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);
        processRequest(line);
      } while (true);
    });
  }
}

/***/ }),

/***/ 368:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var frozenFs = Object.assign({}, __webpack_require__(747));
var Module = typeof Module !== "undefined" ? Module : {};
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = function(status, toThrow) {
  throw toThrow;
};
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = true;
var scriptDirectory = "";
function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}
var read_, readBinary;
var nodeFS;
var nodePath;
if (ENVIRONMENT_IS_NODE) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = __webpack_require__(622).dirname(scriptDirectory) + "/";
  } else {
    scriptDirectory = __dirname + "/";
  }
  read_ = function shell_read(filename, binary) {
    var ret = tryParseAsDataURI(filename);
    if (ret) {
      return binary ? ret : ret.toString();
    }
    if (!nodeFS) nodeFS = frozenFs;
    if (!nodePath) nodePath = __webpack_require__(622);
    filename = nodePath["normalize"](filename);
    return nodeFS["readFileSync"](filename, binary ? null : "utf8");
  };
  readBinary = function readBinary(filename) {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };
  if (process["argv"].length > 1) {
    thisProgram = process["argv"][1].replace(/\\/g, "/");
  }
  arguments_ = process["argv"].slice(2);
  if (true) {
    module["exports"] = Module;
  }
  (function() {})("uncaughtException", function(ex) {
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });
  (function() {})("unhandledRejection", abort);
  quit_ = function(status) {
    process["exit"](status);
  };
  Module["inspect"] = function() {
    return "[Emscripten Module object]";
  };
} else {
}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
moduleOverrides = null;
if (Module["arguments"]) arguments_ = Module["arguments"];
if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
if (Module["quit"]) quit_ = Module["quit"];
var tempRet0 = 0;
var setTempRet0 = function(value) {
  tempRet0 = value;
};
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
var noExitRuntime;
if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
if (typeof WebAssembly !== "object") {
  err("no native wasm support detected");
}
function getValue(ptr, type, noSafe) {
  type = type || "i8";
  if (type.charAt(type.length - 1) === "*") type = "i32";
  switch (type) {
    case "i1":
      return HEAP8[ptr >> 0];
    case "i8":
      return HEAP8[ptr >> 0];
    case "i16":
      return HEAP16[ptr >> 1];
    case "i32":
      return HEAP32[ptr >> 2];
    case "i64":
      return HEAP32[ptr >> 2];
    case "float":
      return HEAPF32[ptr >> 2];
    case "double":
      return HEAPF64[ptr >> 3];
    default:
      abort("invalid type for getValue: " + type);
  }
  return null;
}
var wasmMemory;
var wasmTable = new WebAssembly.Table({
  initial: 31,
  maximum: 31 + 0,
  element: "anyfunc"
});
var ABORT = false;
var EXITSTATUS = 0;
function assert(condition, text) {
  if (!condition) {
    abort("Assertion failed: " + text);
  }
}
function getCFunc(ident) {
  var func = Module["_" + ident];
  assert(
    func,
    "Cannot call unknown function " + ident + ", make sure it is exported"
  );
  return func;
}
function ccall(ident, returnType, argTypes, args, opts) {
  var toC = {
    string: function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    array: function(arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };
  function convertReturnValue(ret) {
    if (returnType === "string") return UTF8ToString(ret);
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}
function cwrap(ident, returnType, argTypes, opts) {
  argTypes = argTypes || [];
  var numericArgs = argTypes.every(function(type) {
    return type === "number";
  });
  var numericRet = returnType !== "string";
  if (numericRet && numericArgs && !opts) {
    return getCFunc(ident);
  }
  return function() {
    return ccall(ident, returnType, argTypes, arguments, opts);
  };
}
var UTF8Decoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(heap.subarray(idx, endPtr));
  } else {
    var str = "";
    while (idx < endPtr) {
      var u0 = heap[idx++];
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = heap[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1);
        continue;
      }
      var u2 = heap[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
      }
    }
  }
  return str;
}
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
}
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 192 | (u >> 6);
      heap[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 224 | (u >> 12);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 240 | (u >> 18);
      heap[outIdx++] = 128 | ((u >> 12) & 63);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    }
  }
  heap[outIdx] = 0;
  return outIdx - startIdx;
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343)
      u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
    if (u <= 127) ++len;
    else if (u <= 2047) len += 2;
    else if (u <= 65535) len += 3;
    else len += 4;
  }
  return len;
}
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}
function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}
var WASM_PAGE_SIZE = 65536;
function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module["HEAP8"] = HEAP8 = new Int8Array(buf);
  Module["HEAP16"] = HEAP16 = new Int16Array(buf);
  Module["HEAP32"] = HEAP32 = new Int32Array(buf);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
}
var DYNAMIC_BASE = 5263680,
  DYNAMICTOP_PTR = 20640;
var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
if (Module["wasmMemory"]) {
  wasmMemory = Module["wasmMemory"];
} else {
  wasmMemory = new WebAssembly.Memory({
    initial: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
    maximum: 2147483648 / WASM_PAGE_SIZE
  });
}
if (wasmMemory) {
  buffer = wasmMemory.buffer;
}
INITIAL_INITIAL_MEMORY = buffer.byteLength;
updateGlobalBufferAndViews(buffer);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == "function") {
      callback(Module);
      continue;
    }
    var func = callback.func;
    if (typeof func === "number") {
      if (callback.arg === undefined) {
        Module["dynCall_v"](func);
      } else {
        Module["dynCall_vi"](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function")
      Module["preRun"] = [Module["preRun"]];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  runtimeInitialized = true;
  if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
  TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  FS.ignorePermissions = false;
  callRuntimeCallbacks(__ATMAIN__);
}
function postRun() {
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function")
      Module["postRun"] = [Module["postRun"]];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
var Math_abs = Math.abs;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_min = Math.min;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function getUniqueRunDependency(id) {
  return id;
}
function addRunDependency(id) {
  runDependencies++;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
}
function removeRunDependency(id) {
  runDependencies--;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
function abort(what) {
  if (Module["onAbort"]) {
    Module["onAbort"](what);
  }
  what += "";
  out(what);
  err(what);
  ABORT = true;
  EXITSTATUS = 1;
  what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
  throw new WebAssembly.RuntimeError(what);
}
function hasPrefix(str, prefix) {
  return String.prototype.startsWith
    ? str.startsWith(prefix)
    : str.indexOf(prefix) === 0;
}
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
  return hasPrefix(filename, dataURIPrefix);
}
var wasmBinaryFile =
  "data:application/octet-stream;base64,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BRAiGiABKAIMKAIABEAgASgCDCgCABAcCyABKAIMEBYLIAFBEGokAAuBAgEBfyMAQRBrIgEkACABIAA2AgwgASABKAIMKAIcNgIEIAEoAgQQ6gIgASABKAIEKAIUNgIIIAEoAgggASgCDCgCEEsEQCABIAEoAgwoAhA2AggLAkAgASgCCEUNACABKAIMKAIMIAEoAgQoAhAgASgCCBAaGiABKAIMIgAgASgCCCAAKAIMajYCDCABKAIEIgAgASgCCCAAKAIQajYCECABKAIMIgAgASgCCCAAKAIUajYCFCABKAIMIgAgACgCECABKAIIazYCECABKAIEIgAgACgCFCABKAIIazYCFCABKAIEKAIUDQAgASgCBCABKAIEKAIINgIQCyABQRBqJAALYAEBfyMAQRBrIgEkACABIAA2AgggASABKAIIQgIQHzYCBAJAIAEoAgRFBEAgAUEAOwEODAELIAEgASgCBC0AACABKAIELQABQQh0ajsBDgsgAS8BDiEAIAFBEGokACAAC1oBAX8jAEEgayICJAAgAiAANgIcIAIgATcDECACIAIoAhwgAikDEBDPATYCDCACKAIMBEAgAigCHCIAIAIpAxAgACkDEHw3AxALIAIoAgwhACACQSBqJAAgAAtvAQF/IwBBEGsiAiQAIAIgADYCCCACIAE7AQYgAiACKAIIQgIQHzYCAAJAIAIoAgBFBEAgAkF/NgIMDAELIAIoAgAgAi8BBjoAACACKAIAIAIvAQZBCHU6AAEgAkEANgIMCyACKAIMGiACQRBqJAALjwEBAX8jAEEQayICJAAgAiAANgIIIAIgATYCBCACIAIoAghCBBAfNgIAAkAgAigCAEUEQCACQX82AgwMAQsgAigCACACKAIEOgAAIAIoAgAgAigCBEEIdjoAASACKAIAIAIoAgRBEHY6AAIgAigCACACKAIEQRh2OgADIAJBADYCDAsgAigCDBogAkEQaiQAC7YCAQF/IwBBMGsiBCQAIAQgADYCJCAEIAE2AiAgBCACNwMYIAQgAzYCFAJAIAQoAiQpAxhCASAEKAIUrYaDUARAIAQoAiRBDGpBHEEAEBUgBEJ/NwMoDAELAkAgBCgCJCgCAEUEQCAEIAQoAiQoAgggBCgCICAEKQMYIAQoAhQgBCgCJCgCBBEPADcDCAwBCyAEIAQoAiQoAgAg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BCgCLEGUAWogBCgCLEGIE2oQtgELCyAEKAIsELkBIAQoAiAEQCAEKAIsELgBCyAEQTBqJAAL1AEBAX8jAEEgayICJAAgAiAANgIYIAIgATcDECACIAIoAhhFOgAPAkAgAigCGEUEQCACIAIpAxCnEBkiADYCGCAARQRAIAJBADYCHAwCCwsgAkEYEBkiADYCCCAARQRAIAItAA9BAXEEQCACKAIYEBYLIAJBADYCHAwBCyACKAIIQQE6AAAgAigCCCACKAIYNgIEIAIoAgggAikDEDcDCCACKAIIQgA3AxAgAigCCCACLQAPQQFxOgABIAIgAigCCDYCHAsgAigCHCEAIAJBIGokACAAC3gBAX8jAEEQayIBJAAgASAANgIIIAEgASgCCEIEEB82AgQCQCABKAIERQRAIAFBADYCDAwBCyABIAEoAgQtAAAgASgCBC0AASABKAIELQACIAEoAgQtAANBCHRqQQh0akEIdGo2AgwLIAEoAgwhACABQRBqJAAgAAuQAQEDfyAAIQECQAJAIABBA3FFDQAgAC0AAEUEQEEADwsDQCABQQFqIgFBA3FFDQEgAS0AAA0ACwwBCwNAIAEiAkEEaiEBIAIoAgAiA0F/cyADQf/9+3dqcUGAgYKEeHFFDQALIANB/wFxRQRAIAIgAGsPCwNAIAItAAEhAyACQQFqIgEhAiADDQALCyABIABrC2EBAX8jAEEQayICIAA2AgggAiABNwMAAkAgAikDACACKAIIKQMIVgRAIAIoAghBADoAACACQX82AgwMAQsgAigCCEEBOgAAIAIoAgggAikDADcDECACQQA2AgwLIAIoAgwL7wEBAX8jAEEgayICJAAgAiAANgIYIAIgATcDECACIAIoAhhCCBAfNgIMAkAgAigCDEUEQCACQX82AhwMAQsgAigCDCACKQMQQv8BgzwAACACKAIMIAIpAxBCCIhC/wGDPAABIAIoAgwgAikDEEIQiEL/AYM8AAIgAigCDCACKQMQQhiIQv8BgzwAAyACKAIMIAIpAxBCIIhC/wGDPAAEIAIoAgwgAikDEEIoiEL/AYM8AAUgAigCDCACKQMQQjCIQv8BgzwABiACKAIMIAIpAxBCOIhC/wGDPAAHIAJBADYCHAsgAigCHBogAkEgaiQAC4sDAQF/IwBBMGsiAyQAIAMgADYCJCADIAE2AiAgAyACNwMYAkAgAygCJC0AKEEBcQRAIANCfzcDKAwBCwJAAkAgAygCJCgCIEEATQ0AIAMpAxhC////////////AFYNACADKQMYQgBYDQEgAygCIA0BCyADKAIkQQxqQRJBABAVIANCfzcDKAwBCyADKAIkLQA1QQFxBEAgA0J/NwMoDAELAn8jAEEQayIAIAMoAiQ2AgwgACgCDC0ANEEBcQsEQCADQgA3AygMAQsgAykDGFAEQCADQgA3AygMAQsgA0IANwMQA0AgAykDECADKQMYVARAIAMgAygCJCADKAIgIAMpAxCnaiADKQMYIAMpAxB9QQEQIiICNwMIIAJCAFMEQCADKAIkQQE6ADUgAykDEFAEQCADQn83AygMBAsgAyADKQMQNwMoDAMLIAMpAwhQBEAgAygCJEEBOgA0BSADIAMpAwggAykDEHw3AxAMAgsLCyADIAMpAxA3AygLIAMpAyghAiADQTBqJAAgAgs2AQF/IwBBEGsiASAANgIMAn4gASgCDC0AAEEBcQRAIAEoAgwpAwggASgCDCkDEH0MAQtCAAsLsgECAX8BfiMAQRBrIgEkACABIAA2AgQgASABKAIEQggQHzYCAAJAIAEoAgBFBEAgAUIANwMIDAELIAEgASgCAC0AAK0gASgCAC0AB61COIYgASgCAC0ABq1CMIZ8IAEoAgAtAAWtQiiGfCABKAIALQAErUIghnwgASgCAC0AA61CGIZ8IAEoAgAtAAKtQhCGfCABKAIALQABrUIIhnx8NwMICyABKQMIIQIgAUEQaiQAIAILqAEBAX8jAEEQayIBJAAgASAANgIIAkAgASgCCCgCIEEATQRAIAEoAghBDGpBEkEAEBUgAUF/NgIMDAELIAEoAggiACAAKAIgQX9qNgIgIAEoAggoAiBFBEAgASgCCEEAQgBBAhAiGiABKAIIKAIABEAgASgCCCgCABAyQQBIBEAgASgCCEEMakEUQQAQFQsLCyABQQA2AgwLIAEoAgwhACABQRBqJAAgAAvxAgICfwF+AkAgAkUNACAAIAJqIgNBf2ogAToAACAAIAE6AAAgAkEDSQ0AIANBfmogAToAACAAIAE6AAEgA0F9aiABOgAAIAAgAToAAiACQQdJDQAgA0F8aiABOgAAIAAgAToAAyACQQlJDQAgAEEAIABrQQNxIgRqIgMg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KAIUIANBngFqIANBnAFqEMQBIAMoAkwgAy8BngEQICADKAJMIAMvAZwBECACQAJAIAMtAIUBQQFxRQ0AIAMoAqQBKQMoQhRaDQAgAygCTEEAECEMAQsgAygCTCADKAKkASgCGBAhCwJAAkAgAygCoAFBgAJxQYACRw0AIAMoAqQBKQMgQv////8PVARAIAMoAqQBKQMoQv////8PVA0BCyADKAJMQX8QISADKAJMQX8QIQwBCwJAIAMoAqQBKQMgQv////8PVARAIAMoAkwgAygCpAEpAyCnECEMAQsgAygCTEF/ECELAkAgAygCpAEpAyhC/////w9UBEAgAygCTCADKAKkASkDKKcQIQwBCyADKAJMQX8QIQsLIAMoAkwgAygCpAEoAjAQUkH//wNxECAgAyADKAKkASgCNCADKAKgARCEAUH//wNxIAMoApABQYAGEIQBQf//A3FqNgKIASADKAJMIAMoAogBQf//A3EQICADKAKgAUGAAnFFBEAgAygCTCADKAKkASgCOBBSQf//A3EQICADKAJMIAMoAqQBKAI8Qf//A3EQICADKAJMIAMoAqQBLwFAECAgAygCTCADKAKkASgCRBAhAkAgAygCpAEpA0hC/////w9UBEAgAygCTCADKAKkASkDSKcQIQwBCyADKAJMQX8QIQsLAn8jAEEQayIAIAMoAkw2AgwgACgCDC0AAEEBcUULBEAgAygCqAFBCGpBFEEAEBUgAygCTBAXIAMoApABECQgA0F/NgKsAQwBCyADKAKoASADQdAAagJ+IwBBEGsiACADKAJMNgIMAn4gACgCDC0AAEEBcQRAIAAoAgwpAxAMAQtCAAsLEDZBAEgEQCADKAJMEBcgAygCkAEQJCADQX82AqwBDAELIAMoAkwQFyADKAKkASgCMARAIAMoAqgBIAMoAqQBKAIwEIgBQQBIBEAgAygCkAEQJCADQX82AqwBDAILCyADKAKQAQRAIAMoAqgBIAMoApABQYAGEIMBQQBIBEAgAygCkAEQJCADQX82AqwBDAILCyADKAKQARAkIAMoAqQBKAI0BEAgAygCqAEgAygCpAEoAjQgAygCoAEQgwFBAEgEQCADQX82AqwBDAILCyADKAKgAUGAAnFFBEAgAygCpAEoAjgEQCADKAKoASADKAKkASgCOBCIAUEASARAIANBfzYC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AygCgAEoAgAgAykDcKdBBHRqKAIAKAI0IAMoAjQQhwEhACADKAKAASgCACADKQNwp0EEdGooAgAgADYCNCADKAKAASgCACADKQNwp0EEdGooAgBBAToABCADQQA2AjQgAxBcIAMgAykDcEIBfDcDcAwCCwALCyADAn4gAykDYCADKQNofUL///////////8AVARAIAMpA2AgAykDaH0MAQtC////////////AAs3A4gBCyADKQOIASEEIANBkAFqJAAgBAumAQEBfyMAQSBrIgMkACADIAA2AhggAyABNgIUIAMgAjYCECADIAMoAhAQ+gEiADYCDAJAIABFBEAgA0EANgIcDAELIAMoAgwgAygCGDYCACADKAIMIAMoAhQ2AgQgAygCFEEQcQRAIAMoAgwiACAAKAIUQQJyNgIUIAMoAgwiACAAKAIYQQJyNgIYCyADIAMoAgw2AhwLIAMoAhwhACADQSBqJAAgAAvVAQEBfyMAQSBrIgQkACAEIAA2AhggBCABNwMQIAQgAjYCDCAEIAM2AggCQAJAIAQpAxBC////////////AFcEQCAEKQMQQoCAgICAgICAgH9ZDQELIAQoAghBBEE9EBUgBEF/NgIcDAELAn8gBCkDECEBIAQoAgwhACAEKAIYIgIoAkxBf0wEQCACIAEgABCXAQwBCyACIAEgABCXAQtBAEgEQCAEKAIIQQRBtJwBKAIAEBUgBEF/NgIcDAELIARBADYCHAsgBCgCHCEAIARBIGokACAACycAAn9BAEEAIAAQBSIAIABBG0YbIgBFDQAaQbScASAANgIAQQALGgteAQF/IwBBEGsiAyQAIAMgAUHAgIACcQR/IAMgAkEEajYCDCACKAIABUEACzYCACAAIAFBgIACciADEBEiAEGBYE8EQEG0nAFBACAAazYCAEF/IQALIANBEGokACAACzMBAX8CfyAAEAYiAUFhRgRAIAAQEiEBCyABQYFgTwsEf0G0nAFBACABazYCAEF/BSABCwtpAQJ/AkAgACgCFCAAKAIcTQ0AIABBAEEAIAAoAiQRAQAaIAAoAhQNAEF/DwsgACgCBCIBIAAoAggiAkkEQCAAIAEgAmusQQEgACgCKBEQABoLIABBADYCHCAAQgA3AxAgAEIANwIEQQALpgEBAX8jAEEQayICJAAgAiAANgIIIAIgATYCBAJAIAIoAggtAChBAXEEQCACQX82AgwMAQsgAigCCCgCAARAIAIoAggoAgAgAigCBBBsQQBIBEAgAigCCEEMaiACKAIIKAIAEBggAkF/NgIMDAILCyACKAIIIAJBBGpCBEETECJCAFMEQCACQX82AgwMAQsgAkEANgIMCyACKAIMIQAgAkEQaiQAIAALVQEBfyMAQRBrIgEkACABIAA2AgwCQAJAIAEoAgwoAiRBAUYNACABKAIMKAIkQQJGDQAMAQsgASgCDEEAQgBBChAiGiABKAIMQQA2AiQLIAFBEGokAAtIAgF/AX4jAEEQayIDJAAgAyAANgIMIAMgATYCCCADIAI2AgQgAygCDCADKAIIIAMoAgQgAygCDEEIahBVIQQgA0EQaiQAIAQLJAEBfyMAQRBrIgMkACADIAI2AgwgACABIAIQpwIgA0EQaiQAC8gRAg9/AX4jAEHQAGsiBSQAIAUgATYCTCAFQTdqIRMgBUE4aiEQQQAhAQJAAkADQAJAIA5BAEgNACABQf////8HIA5rSgRAQbScAUE9NgIAQX8hDgwBCyABIA5qIQ4LIAUoAkwiCiEBAkACQCAKLQAAIgYEQANAAkACQCAGQf8BcSIHRQRAIAEhBgwBCyAHQSVHDQEgASEGA0AgAS0AAUElRw0BIAUgAUECaiIHNgJMIAZBAWohBiABLQACIQkgByEBIAlBJUYNAAsLIAYgCmshASAABEAgACAKIAEQIwsgAQ0FQX8hD0EBIQYgBSgCTCEBAkAgBSgCTCwAAUFQakEKTw0AIAEtAAJBJEcNACABLAABQVBqIQ9BASESQQMhBgsgBSABIAZqIgE2AkxBACEGAkAgASwAACIRQWBqIglBH0sEQCABIQcMAQsgASEHQQEgCXQiDEGJ0QRxRQ0AA0AgBSABQQFqIgc2AkwgBiAMciEGIAEsAAEiEUFgaiIJQR9LDQEgByEBQQEgCXQiDEGJ0QRxDQALCwJAIBFBKkYEQCAFAn8CQCAHLAABQVBqQQpPDQAgBSgCTCIBLQACQSRHDQAgASwAAUECdCAEakHAfmpBCjYCACABLAABQQN0IANqQYB9aigCACENQQEhEiABQQNqDAELIBINCUEAIRJBACENIAAEQCACIAIoAgAiAUEEajYCACABKAIAIQ0LIAUoAkxBAWoLIgE2AkwgDUF/Sg0BQQAgDWshDSAGQYDAAHIhBgwBCyAFQcwAahCkASINQQBIDQcgBSgCTCEBC0F/IQgCQCABLQAAQS5HDQAgAS0AAUEqRgRAAkAgASwAAkFQakEKTw0AIAUoAkwiAS0AA0EkRw0AIAEsAAJBAnQgBGpBwH5qQQo2AgAgASwAAkEDdCADakGAfWooAgAhCCAFIAFBBGoiATYCTAwCCyASDQggAAR/IAIgAigCACIBQQRqNgIAIAEoAgAFQQALIQggBSAFKAJMQQJqIgE2AkwMAQsgBSABQQFqNgJMIAVBzABqEKQBIQggBSgCTCEBC0EAIQcDQCAHIQxBfyELIAEsAABBv39qQTlLDQggBSABQQFqIhE2AkwgASwAACEHIBEhASAHIAxBOmxqQe+CAWotAAAiB0F/akEISQ0ACyAHRQ0HAkACQAJAIAdBE0YEQCAPQX9MDQEMCwsgD0EASA0BIAQgD0ECdGogBzYCACAFIAMgD0EDdGopAwA3A0ALQQAhASAARQ0HDAELIABFDQUgBUFAayAHIAIQowEgBSgCTCERCyAGQf//e3EiCSAGIAZBgMAAcRshBkEAIQtBl4MBIQ8gECEHAkACQAJAAn8CQAJAAkACQAJ/AkACQAJAAkACQAJAAkAgEUF/aiwAACIBQV9xIAEgAUEPcUEDRhsgASAMGyIBQah/ag4hBBMTExMTExMTDhMPBg4ODhMGExMTEwIFAxMTCRMBExMEAAsCQCABQb9/ag4HDhMLEw4ODgALIAFB0wBGDQkMEgsgBSkDQCEUQZeDAQwFC0EAIQECQAJAAkACQAJAAkACQCAMQf8BcQ4IAAECAwQZBQYZCyAFKAJAIA42AgAMGAsgBSgCQCAONgIADBcLIAUoAkAgDqw3AwAMFgsgBSgCQCAOOwEADBULIAUoAkAgDjoAAAwUCyAFKAJAIA42AgAMEwsgBSgCQCAOrDcDAAwSCyAIQQggCEEISxshCCAGQQhyIQZB+AAhAQsgBSkDQCAQIAFBIHEQqwIhCiAGQQhxRQ0DIAUpA0BQDQMgAUEEdkGXgwFqIQ9BAiELDAMLIAUpA0AgEBCqAiEKIAZBCHFFDQIgCCAQIAprIgFBAWogCCABShshCAwCCyAFKQNAIhRCf1cEQCAFQgAgFH0iFDcDQEEBIQtBl4MBDAELIAZBgBBxBEBBASELQZiDAQwBC0GZgwFBl4MBIAZBAXEiCxsLIQ8gFCAQEEIhCgsgBkH//3txIAYgCEF/ShshBiAFKQNAIRQCQCAIDQAgFFBFDQBBACEIIBAhCgwLCyAIIBRQIBAgCmtqIgEgCCABShshCAwKCyAFKAJAIgFBoYMBIAEbIgpBACAIEKcBIgEgCCAKaiABGyEHIAkhBiABIAprIAggARshCAwJCyAIBEAgBSgCQAwCC0EAIQEgAEEgIA1BACAGECcMAgsgBUEANgIMIAUgBSkDQD4CCCAFIAVBCGo2AkBBfyEIIAVBCGoLIQdBACEBAkADQCAHKAIAIglFDQECQCAFQQRqIAkQpgEiCkEASCIJDQAgCiAIIAFrSw0AIAdBBGohByAIIAEgCmoiAUsNAQwCCwtBfyELIAkNCwsgAEEgIA0gASAGECcgAUUEQEEAIQEMAQtBACEMIAUoAkAhBwNAIAcoAgAiCUUNASAFQQRqIAkQpgEiCSAMaiIMIAFKDQEgACAFQQRqIAkQIyAHQQRqIQcgDCABSQ0ACwsgAEEgIA0gASAGQYDAAHMQJyANIAEgDSABShshAQwHCyAAIAUrA0AgDSAIIAYgAUEVER0AIQEMBgsgBSAFKQNAPAA3QQEhCCATIQogCSEGDAMLIAUgAUEBaiIHNgJMIAEtAAEhBiAHIQEMAAALAAsgDiELIAANBCASRQ0BQQEhAQNAIAQgAUECdGooAgAiAARAIAMgAUEDdGogACACEKMBQQEhCyABQQFqIgFBCkcNAQwGCwtBASELIAFBCUsNBEF/IQsgBCABQQJ0aigCAA0EA0AgASIAQQFqIgFBCkcEQCAEIAFBAnRqKAIARQ0BCwtBf0EBIABBCUkbIQsMBAsgAEEgIAsgByAKayIJIAggCCAJSBsiB2oiDCANIA0gDEgbIgEgDCAGECcgACAPIAsQIyAAQTAgASAMIAZBgIAEcxAnIABBMCAHIAlBABAnIAAgCiAJECMgAEEgIAEgDCAGQYDAAHMQJwwBCwtBACELDAELQX8hCwsgBUHQAGokACALC7cBAQR/AkAgAigCECIDBH8gAwUgAhCuAg0BIAIoAhALIAIoAhQiBWsgAUkEQCACIAAgASACKAIkEQEADwsCQCACLABLQQBIDQAgASEEA0AgBCIDRQ0BIAAgA0F/aiIEai0AAEEKRw0ACyACIAAgAyACKAIkEQEAIgQgA0kNASABIANrIQEgACADaiEAIAIoAhQhBSADIQYLIAUgACABEBoaIAIgAigCFCABajYCFCABIAZqIQQLIAQL0hEBAX8jAEGwAWsiBiQAIAYgADYCqAEgBiABNgKkASAGIAI2AqABIAYgAzYCnAEgBiAENgKYASAGIAU2ApQBIAZBADYCkAEDQCAGKAKQAUEPS0UEQCAGQSBqIAYoApABQQF0akEAOwEAIAYgBigCkAFBAWo2ApABDAELCyAGQQA2AowBA0AgBigCjAEgBigCoAFPRQRAIAZBIGogBigCpAEgBigCjAFBAXRqLwEAQQF0aiIAIAAvAQBBAWo7AQAgBiAGKAKMAUEBajYCjAEMAQsLIAYgBigCmAEoAgA2AoABIAZBDzYChAEDQAJAIAYoAoQBQQFJDQAgBkEgaiAGKAKEAUEBdGovAQANACAGIAYoAoQBQX9qNgKEAQwBCwsgBigCgAEgBigChAFLBEAgBiAGKAKEATYCgAELAkAgBigChAFFBEAgBkHAADoAWCAGQQE6AFkgBkEAOwFaIAYoApwBIgEoAgAhACABIABBBGo2AgAgACAGQdgAaiIBKAEANgEAIAYoApwBIgIoAgAhACACIABBBGo2AgAgACABKAEANgEAIAYoApgBQQE2AgAgBkEANgKsAQwBCyAGQQE2AogBA0ACQCAGKAKIASAGKAKEAU8NACAGQSBqIAYoAogBQQF0ai8BAA0AIAYgBigCiAFBAWo2AogBDAELCyAGKAKAASAGKAKIAUkEQCAGIAYoAogBNgKAAQsgBkEBNgJ0IAZBATYCkAEDQCAGKAKQAUEPTQRAIAYgBigCdEEBdDYCdCAGIAYoAnQgBkEgaiAGKAKQAUEBdGovAQBrNgJ0IAYoAnRBAEgEQCAGQX82AqwBDAMFIAYgBigCkAFBAWo2ApABDAILAAsLAkAgBigCdEEATA0AIAYoAqgBBEAgBigChAFBAUYNAQsgBkF/NgKsAQwBCyAGQQA7AQIgBkEBNgKQAQNAIAYoApABQQ9PRQRAIAYoApABQQFqQQF0IAZqIAYoApABQQF0IAZqLwEAIAZBIGogBigCkAFBAXRqLwEAajsBACAGIAYoApABQQFqNgKQAQwBCwsgBkEANgKMAQNAIAYoAowBIAYoAqABSQRAIAYoAqQBIAYoAowBQQF0ai8BAARAIAYoApQBIQEgBigCpAEgBigCjAEiAkEBdGovAQBBAXQgBmoiAy8BACEAIAMgAEEBajsBACAAQf//A3FBAXQgAWogAjsBAAsgBiAGKAKMAUEBajYCjAEMAQsLAkACQAJAAkAgBigCqAEOAgABAgsgBiAGKAKUASIANgJMIAYgADYCUCAGQRQ2AkgMAgsgBkGw6wA2AlAgBkHw6wA2AkwgBkGBAjYCSAwBCyAGQbDsADYCUCAGQfDsADYCTCAGQQA2AkgLIAZBADYCbCAGQQA2AowBIAYgBigCiAE2ApABIAYgBigCnAEoAgA2AlQgBiAGKAKAATYCfCAGQQA2AnggBkF/NgJgIAZBASAGKAKAAXQ2AnAgBiAGKAJwQQFrNgJcAkACQCAGKAKoAUEBRgRAIAYoAnBB1AZLDQELIAYoAqgBQQJHDQEgBigCcEHQBE0NAQsgBkEBNgKsAQwBCwNAIAYgBigCkAEgBigCeGs6AFkCQCAGKAKUASAGKAKMAUEBdGovAQBBAWogBigCSEkEQCAGQQA6AFggBiAGKAKUASAGKAKMAUEBdGovAQA7AVoMAQsCQCAGKAKUASAGKAKMAUEBdGovAQAgBigCSE8EQCAGIAYoAkwgBigClAEgBigCjAFBAXRqLwEAIAYoAkhrQQF0ai8BADoAWCAGIAYoAlAgBigClAEgBigCjAFBAXRqLwEAIAYoAkhrQQF0ai8BADsBWgwBCyAGQeAAOgBYIAZBADsBWgsLIAZBASAGKAKQASAGKAJ4a3Q2AmggBkEBIAYoAnx0NgJkIAYgBigCZDYCiAEDQCAGIAYoAmQgBigCaGs2AmQgBigCVCAGKAJkIAYoAmwgBigCeHZqQQJ0aiAGQdgAaigBADYBACAGKAJkDQALIAZBASAGKAKQAUEBa3Q2AmgDQCAGKAJsIAYoAmhxBEAgBiAGKAJoQQF2NgJoDAELCwJAIAYoAmgEQCAGIAYoAmwgBigCaEEBa3E2AmwgBiAGKAJoIAYoAmxqNgJsDAELIAZBADYCbAsgBiAGKAKMAUEBajYCjAEgBkEgaiAGKAKQAUEBdGoiAS8BAEF/aiEAIAEgADsBAAJAIABB//8DcUUEQCAGKAKQASAGKAKEAUYNASAGIAYoAqQBIAYoApQBIAYoAowBQQF0ai8BAEEBdGovAQA2ApABCwJAIAYoApABIAYoAoABTQ0AIAYoAmAgBigCbCAGKAJccUYNACAGKAJ4RQRAIAYgBigCgAE2AngLIAYgBigCVCAGKAKIAUECdGo2AlQgBiAGKAKQASAGKAJ4azYCfCAGQQEgBigCfHQ2AnQDQAJAIAYoAnwgBigCeGogBigChAFPDQAgBiAGKAJ0IAZBIGogBigCfCAGKAJ4akEBdGovAQBrNgJ0IAYoAnRBAEwNACAGIAYoAnxBAWo2AnwgBiAGKAJ0QQF0NgJ0DAELCyAGIAYoAnBBASAGKAJ8dGo2AnACQAJAIAYoAqgBQQFGBEAgBigCcEHUBksNAQsgBigCqAFBAkcNASAGKAJwQdAETQ0BCyAGQQE2AqwBDAQLIAYgBigCbCAGKAJccTYCYCAGKAKcASgCACAGKAJgQQJ0aiAGKAJ8OgAAIAYoApwBKAIAIAYoAmBBAnRqIAYoAoABOgABIAYoApwBKAIAIAYoAmBBAnRqIAYoAlQgBigCnAEoAgBrQQJ1OwECCwwBCwsgBigCbARAIAZBwAA6AFggBiAGKAKQASAGKAJ4azoAWSAGQQA7AVogBigCVCAGKAJsQQJ0aiAGQdgAaigBADYBAAsgBigCnAEiACAAKAIAIAYoAnBBAnRqNgIAIAYoApgBIAYoAoABNgIAIAZBADYCrAELIAYoAqwBIQAgBkGwAWokACAAC7ECAQF/IwBBIGsiAyQAIAMgADYCGCADIAE2AhQgAyACNgIQIAMgAygCGCgCBDYCDCADKAIMIAMoAhBLBEAgAyADKAIQNgIMCwJAIAMoAgxFBEAgA0EANgIcDAELIAMoAhgiACAAKAIEIAMoAgxrNgIEIAMoAhQgAygCGCgCACADKAIMEBoaAkAgAygCGCgCHCgCGEEBRgRAIAMoAhgoAjAgAygCFCADKAIMED0hACADKAIYIAA2AjAMAQsgAygCGCgCHCgCGEECRgRAIAMoAhgoAjAgAygCFCADKAIMEBshACADKAIYIAA2AjALCyADKAIYIgAgAygCDCAAKAIAajYCACADKAIYIgAgAygCDCAAKAIIajYCCCADIAMoAgw2AhwLIAMoAhwhACADQSBqJAAgAAvtAQEBfyMAQRBrIgEgADYCCAJAAkACQCABKAIIRQ0AIAEoAggoAiBFDQAgASgCCCgCJA0BCyABQQE2AgwMAQsgASABKAIIKAIcNgIEAkACQCABKAIERQ0AIAEoAgQoAgAgASgCCEcNACABKAIEKAIEQSpGDQEgASgCBCgCBEE5Rg0BIAEoAgQoAgRBxQBGDQEgASgCBCgCBEHJAEYNASABKAIEKAIEQdsARg0BIAEoAgQoAgRB5wBGDQEgASgCBCgCBEHxAEYNASABKAIEKAIEQZoFRg0BCyABQQE2AgwMAQsgAUEANgIMCyABKAIMC9IEAQF/IwBBIGsiAyAANgIcIAMgATYCGCADIAI2AhQgAyADKAIcQdwWaiADKAIUQQJ0aigCADYCECADIAMoAhRBAXQ2AgwDQAJAIAMoAgwgAygCHCgC0ChKDQACQCADKAIMIAMoAhwoAtAoTg0AIAMoAhggAygCHCADKAIMQQJ0akHgFmooAgBBAnRqLwEAIAMoAhggAygCHEHcFmogAygCDEECdGooAgBBAnRqLwEATgRAIAMoAhggAygCHCADKAIMQQJ0akHgFmooAgBBAnRqLwEAIAMoAhggAygCHEHcFmogAygCDEECdGooAgBBAnRqLwEARw0BIAMoAhwgAygCDEECdGpB4BZqKAIAIAMoAhxB2Chqai0AACADKAIcQdwWaiADKAIMQQJ0aigCACADKAIcQdgoamotAABKDQELIAMgAygCDEEBajYCDAsgAygCGCADKAIQQQJ0ai8BACADKAIYIAMoAhxB3BZqIAMoAgxBAnRqKAIAQQJ0ai8BAEgNAAJAIAMoAhggAygCEEECdGovAQAgAygCGCADKAIcQdwWaiADKAIMQQJ0aigCAEECdGovAQBHDQAgAygCECADKAIcQdgoamotAAAgAygCHEHcFmogAygCDEECdGooAgAgAygCHEHYKGpqLQAASg0ADAELIAMoAhxB3BZqIAMoAhRBAnRqIAMoAhxB3BZqIAMoAgxBAnRqKAIANgIAIAMgAygCDDYCFCADIAMoAgxBAXQ2AgwMAQsLIAMoAhxB3BZqIAMoAhRBAnRqIAMoAhA2AgAL5wgBA38jAEEwayICJAAgAiAANgIsIAIgATYCKCACIAIoAigoAgA2AiQgAiACKAIoKAIIKAIANgIgIAIgAigCKCgCCCgCDDYCHCACQX82AhAgAigCLEEANgLQKCACKAIsQb0ENgLUKCACQQA2AhgDQCACKAIYIAIoAhxORQRAAkAgAigCJCACKAIYQQJ0ai8BAARAIAIgAigCGCIBNgIQIAIoAixB3BZqIQMgAigCLCIEKALQKEEBaiEAIAQgADYC0CggAEECdCADaiABNgIAIAIoAhggAigCLEHYKGpqQQA6AAAMAQsgAigCJCACKAIYQQJ0akEAOwECCyACIAIoAhhBAWo2AhgMAQsLA0AgAigCLCgC0ChBAkgEQAJAIAIoAhBBAkgEQCACIAIoAhBBAWoiADYCEAwBC0EAIQALIAIoAixB3BZqIQMgAigCLCIEKALQKEEBaiEBIAQgATYC0CggAUECdCADaiAANgIAIAIgADYCDCACKAIkIAIoAgxBAnRqQQE7AQAgAigCDCACKAIsQdgoampBADoAACACKAIsIgAgACgCqC1Bf2o2AqgtIAIoAiAEQCACKAIsIgAgACgCrC0gAigCICACKAIMQQJ0ai8BAms2AqwtCwwBCwsgAigCKCACKAIQNgIEIAIgAigCLCgC0ChBAm02AhgDQCACKAIYQQFIRQRAIAIoAiwgAigCJCACKAIYEHUgAiACKAIYQX9qNgIYDAELCyACIAIoAhw2AgwDQCACIAIoAiwoAuAWNgIYIAIoAixB3BZqIQEgAigCLCIDKALQKCEAIAMgAEF/ajYC0CggAigCLCAAQQJ0IAFqKAIANgLgFiACKAIsIAIoAiRBARB1IAIgAigCLCgC4BY2AhQgAigCGCEBIAIoAixB3BZqIQMgAigCLCIEKALUKEF/aiEAIAQgADYC1CggAEECdCADaiABNgIAIAIoAhQhASACKAIsQdwWaiEDIAIoAiwiBCgC1ChBf2ohACAEIAA2AtQoIABBAnQgA2ogATYCACACKAIkIAIoAgxBAnRqIAIoAiQgAigCGEECdGovAQAgAigCJCACKAIUQQJ0ai8BAGo7AQAgAigCDCACKAIsQdgoamoCfyACKAIYIAIoAixB2Chqai0AACACKAIUIAIoAixB2Chqai0AAE4EQCACKAIYIAIoAixB2Chqai0AAAwBCyACKAIUIAIoAixB2Chqai0AAAtBAWo6AAAgAigCJCACKAIUQQJ0aiACKAIMIgA7AQIgAigCJCACKAIYQQJ0aiAAOwECIAIgAigCDCIAQQFqNgIMIAIoAiwgADYC4BYgAigCLCACKAIkQQEQdSACKAIsKALQKEECTg0ACyACKAIsKALgFiEBIAIoAixB3BZqIQMgAigCLCIEKALUKEF/aiEAIAQgADYC1CggAEECdCADaiABNgIAIAIoAiwgAigCKBDlAiACKAIkIAIoAhAgAigCLEG8FmoQ5AIgAkEwaiQAC04BAX8jAEEQayICIAA7AQogAiABNgIEAkAgAi8BCkEBRgRAIAIoAgRBAUYEQCACQQA2AgwMAgsgAkEENgIMDAELIAJBADYCDAsgAigCDAvNAgEBfyMAQTBrIgUkACAFIAA2AiwgBSABNgIoIAUgAjYCJCAFIAM3AxggBSAENgIUIAVCADcDCANAIAUpAwggBSkDGFQEQCAFIAUoAiQgBSkDCKdqLQAAOgAHIAUoAhRFBEAgBSAFKAIsKAIUQQJyOwESIAUgBS8BEiAFLwESQQFzbEEIdjsBEiAFIAUtAAcgBS8BEkH/AXFzOgAHCyAFKAIoBEAgBSgCKCAFKQMIp2ogBS0ABzoAAAsgBSgCLCgCDEF/cyAFQQdqIgBBARAbQX9zIQEgBSgCLCABNgIMIAUoAiwgBSgCLCgCECAFKAIsKAIMQf8BcWpBhYiiwABsQQFqNgIQIAUgBSgCLCgCEEEYdjoAByAFKAIsKAIUQX9zIABBARAbQX9zIQAgBSgCLCAANgIUIAUgBSkDCEIBfDcDCAwBCwsgBUEwaiQAC20BAX8jAEEgayIEJAAgBCAANgIYIAQgATYCFCAEIAI3AwggBCADNgIEAkAgBCgCGEUEQCAEQQA2AhwMAQsgBCAEKAIUIAQpAwggBCgCBCAEKAIYQQhqEL8BNgIcCyAEKAIcIQAgBEEgaiQAIAALpwMBAX8jAEEgayIEJAAgBCAANgIYIAQgATcDECAEIAI2AgwgBCADNgIIIAQgBCgCGCAEKQMQIAQoAgxBABBFIgA2AgACQCAARQRAIARBfzYCHAwBCyAEIAQoAhggBCkDECAEKAIMEMEBIgA2AgQgAEUEQCAEQX82AhwMAQsCQAJAIAQoAgxBCHENACAEKAIYKAJAIAQpAxCnQQR0aigCCEUNACAEKAIYKAJAIAQpAxCnQQR0aigCCCAEKAIIEDlBAEgEQCAEKAIYQQhqQQ9BABAVIARBfzYCHAwDCwwBCyAEKAIIEDwgBCgCCCAEKAIAKAIYNgIsIAQoAgggBCgCACkDKDcDGCAEKAIIIAQoAgAoAhQ2AiggBCgCCCAEKAIAKQMgNwMgIAQoAgggBCgCACgCEDsBMCAEKAIIIAQoAgAvAVI7ATIgBCgCCEEgQQAgBCgCAC0ABkEBcRtB3AFyrTcDAAsgBCgCCCAEKQMQNwMQIAQoAgggBCgCBDYCCCAEKAIIIgAgACkDAEIDhDcDACAEQQA2AhwLIAQoAhwhACAEQSBqJAAgAAt3AQF/IwBBEGsiASAANgIIIAFChSo3AwACQCABKAIIRQRAIAFBADYCDAwBCwNAIAEoAggtAAAEQCABIAEoAggtAACtIAEpAwBCIX58Qv////8PgzcDACABIAEoAghBAWo2AggMAQsLIAEgASkDAD4CDAsgASgCDAuHBQEBfyMAQTBrIgUkACAFIAA2AiggBSABNgIkIAUgAjcDGCAFIAM2AhQgBSAENgIQAkACQAJAIAUoAihFDQAgBSgCJEUNACAFKQMYQv///////////wBYDQELIAUoAhBBEkEAEBUgBUEAOgAvDAELIAUoAigoAgBFBEAgBSgCKEGAAiAFKAIQEFpBAXFFBEAgBUEAOgAvDAILCyAFIAUoAiQQezYCDCAFIAUoAgwgBSgCKCgCAHA2AgggBSAFKAIoKAIQIAUoAghBAnRqKAIANgIEA0ACQCAFKAIERQ0AAkAgBSgCBCgCHCAFKAIMRw0AIAUoAiQgBSgCBCgCABBbDQACQAJAIAUoAhRBCHEEQCAFKAIEKQMIQn9SDQELIAUoAgQpAxBCf1ENAQsgBSgCEEEKQQAQFSAFQQA6AC8MBAsMAQsgBSAFKAIEKAIYNgIEDAELCyAFKAIERQRAIAVBIBAZIgA2AgQgAEUEQCAFKAIQQQ5BABAVIAVBADoALwwCCyAFKAIEIAUoAiQ2AgAgBSgCBCAFKAIoKAIQIAUoAghBAnRqKAIANgIYIAUoAigoAhAgBSgCCEECdGogBSgCBDYCACAFKAIEIAUoAgw2AhwgBSgCBEJ/NwMIIAUoAigiACAAKQMIQgF8NwMIAkAgBSgCKCIAKQMIuiAAKAIAuEQAAAAAAADoP6JkRQ0AIAUoAigoAgBBgICAgHhPDQAgBSgCKCAFKAIoKAIAQQF0IAUoAhAQWkEBcUUEQCAFQQA6AC8MAwsLCyAFKAIUQQhxBEAgBSgCBCAFKQMYNwMICyAFKAIEIAUpAxg3AxAgBUEBOgAvCyAFLQAvQQFxIQAgBUEwaiQAIAALWQIBfwF+AkACf0EAIABFDQAaIACtIAGtfiIDpyICIAAgAXJBgIAESQ0AGkF/IAIgA0IgiKcbCyICEBkiAEUNACAAQXxqLQAAQQNxRQ0AIABBACACEDMLIAAL+QMBAX8jAEHQAGsiCCQAIAggADYCSCAIIAE3A0AgCCACNwM4IAggAzYCNCAIIAQ6ADMgCCAFNgIsIAggBjcDICAIIAc2AhwCQAJAAkAgCCgCSEUNACAIKQNAIAgpAzh8IAgpA0BUDQAgCCgCLA0BIAgpAyBQDQELIAgoAhxBEkEAEBUgCEEANgJMDAELIAhBgAEQGSIANgIYIABFBEAgCCgCHEEOQQAQFSAIQQA2AkwMAQsgCCgCGCAIKQNANwMAIAgoAhggCCkDQCAIKQM4fDcDCCAIKAIYQShqEDwgCCgCGCAILQAzOgBgIAgoAhggCCgCLDYCECAIKAIYIAgpAyA3AxgjAEEQayIAIAgoAhhB5ABqNgIMIAAoAgxBADYCACAAKAIMQQA2AgQgACgCDEEANgIIIwBBEGsiACAIKAJINgIMIAAoAgwpAxhC/4EBgyEBIAhBfzYCCCAIQQc2AgQgCEEONgIAQRAgCBA3IAGEIQEgCCgCGCABNwNwIAgoAhhBAUEAIAgoAhgpA3BCwACDQgBSG0EARzoAeCAIKAI0BEAgCCgCGEEoaiAIKAI0IAgoAhwQmgFBAEgEQCAIKAIYEBYgCEEANgJMDAILCyAIIAgoAkhBASAIKAIYIAgoAhwQkAE2AkwLIAgoAkwhACAIQdAAaiQAIAALlgIBAX8jAEEwayIDJAAgAyAANgIkIAMgATcDGCADIAI2AhQCQCADKAIkKAJAIAMpAxinQQR0aigCAEUEQCADKAIUQRRBABAVIANCADcDKAwBCyADIAMoAiQoAkAgAykDGKdBBHRqKAIAKQNINwMIIAMoAiQoAgAgAykDCEEAEChBAEgEQCADKAIUIAMoAiQoAgAQGCADQgA3AygMAQsgAyADKAIkKAIAIAMoAhQQiwMiADYCBCAAQQBIBEAgA0IANwMoDAELIAMpAwggAygCBK18Qv///////////wBWBEAgAygCFEEEQRYQFSADQgA3AygMAQsgAyADKQMIIAMoAgStfDcDKAsgAykDKCEBIANBMGokACABC3cBAX8jAEEQayICIAA2AgggAiABNgIEAkACQAJAIAIoAggpAyhC/////w9aDQAgAigCCCkDIEL/////D1oNACACKAIEQYAEcUUNASACKAIIKQNIQv////8PVA0BCyACQQE6AA8MAQsgAkEAOgAPCyACLQAPQQFxC7QCAQF/IwBBMGsiAyQAIAMgADYCKCADIAE3AyAgAyACNgIcAkAgAykDIFAEQCADQQE6AC8MAQsgAyADKAIoKQMQIAMpAyB8NwMIAkAgAykDCCADKQMgWgRAIAMpAwhC/////wBYDQELIAMoAhxBDkEAEBUgA0EAOgAvDAELIAMgAygCKCgCACADKQMIp0EEdBBPIgA2AgQgAEUEQCADKAIcQQ5BABAVIANBADoALwwBCyADKAIoIAMoAgQ2AgAgAyADKAIoKQMINwMQA0AgAykDECADKQMIWkUEQCADKAIoKAIAIAMpAxCnQQR0ahCOASADIAMpAxBCAXw3AxAMAQsLIAMoAiggAykDCCIBNwMQIAMoAiggATcDCCADQQE6AC8LIAMtAC9BAXEhACADQTBqJAAgAAvMAQEBfyMAQSBrIgIkACACIAA3AxAgAiABNgIMIAJBMBAZIgE2AggCQCABRQRAIAIoAgxBDkEAEBUgAkEANgIcDAELIAIoAghBADYCACACKAIIQgA3AxAgAigCCEIANwMIIAIoAghCADcDICACKAIIQgA3AxggAigCCEEANgIoIAIoAghBADoALCACKAIIIAIpAxAgAigCDBCBAUEBcUUEQCACKAIIECUgAkEANgIcDAELIAIgAigCCDYCHAsgAigCHCEBIAJBIGokACABC9kCAQF/IwBBIGsiAyQAIAMgADYCGCADIAE2AhQgAyACNgIQIAMgA0EMakIEECo2AggCQCADKAIIRQRAIANBfzYCHAwBCwNAIAMoAhQEQCADKAIUKAIEIAMoAhBxQYAGcQRAIAMoAghCABAtGiADKAIIIAMoAhQvAQgQICADKAIIIAMoAhQvAQoQIAJ/IwBBEGsiACADKAIINgIMIAAoAgwtAABBAXFFCwRAIAMoAhhBCGpBFEEAEBUgAygCCBAXIANBfzYCHAwECyADKAIYIANBDGpCBBA2QQBIBEAgAygCCBAXIANBfzYCHAwECyADKAIULwEKQQBKBEAgAygCGCADKAIUKAIMIAMo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AgggASgCBEEANgIgIAEoAgRBADYCJCABKAIEQQA6ACggASgCBEEANgIsIAEoAgRBATYCMCMAQRBrIgAgASgCBEEMajYCDCAAKAIMQQA2AgAgACgCDEEANgIEIAAoAgxBADYCCCABKAIEQQA6ADQgASgCBEEAOgA1IAEgASgCBDYCDAsgASgCDCEAIAFBEGokACAAC4IFAQF/IwBB4ABrIgMkACADIAA2AlggAyABNgJUIAMgAjYCUAJAAkAgAygCVEEATgRAIAMoAlgNAQsgAygCUEESQQAQFSADQQA2AlwMAQsgAyADKAJUNgJMIwBBEGsiACADKAJYNgIMIAMgACgCDCkDGDcDQEHgmwEpAwBCf1EEQCADQX82AhQgA0EDNgIQIANBBzYCDCADQQY2AgggA0ECNgIEIANBATYCAEHgmwFBACADEDc3AwAgA0F/NgI0IANBDzYCMCADQQ02AiwgA0EMNgIoIANBCjYCJCADQQk2AiBB6JsBQQggA0EgahA3NwMAC0HgmwEpAwAgAykDQEHgmwEpAwCDUgRAIAMoAlBBHEEAEBUgA0EANgJcDAELQeibASkDACADKQNAQeibASkDAINSBEAgAyADKAJMQRByNgJMCyADKAJMQRhxQRhGBEAgAygCUEEZQQAQFSADQQA2AlwMAQsgAyADKAJYIAMoAlAQ+AE2AjwCQAJAAkAgAygCPEEBag4CAAECCyADQQA2AlwMAgsgAygCTEEBcUUEQCADKAJQQQlBABAVIANBADYCXAwCCyADIAMoAlggAygCTCADKAJQEGY2AlwMAQsgAygCTEECcQRAIAMoAlBBCkEAEBUgA0EANgJcDAELIAMoAlgQSUEASARAIAMoAlAgAygCWBAYIANBADYCXAwBCwJAIAMoAkxBCHEEQCADIAMoAlggAygCTCADKAJQEGY2AjgMAQsgAyADKAJYIAMoAkwgAygCUBD3ATYCOAsgAygCOEUEQCADKAJYEDIaIANBADYCXAwBCyADIAMoAjg2AlwLIAMoAlwhACADQeAAaiQAIAALjgEBAX8jAEEQayICJAAgAiAANgIMIAIgATYCCCACQQA2AgQgAigCCARAIwBBEGsiACACKAIINgIMIAIgACgCDCgCADYCBCACKAIIELABQQFGBEAjAEEQayIAIAIoAgg2AgxBtJwBIAAoAgwoAgQ2AgALCyACKAIMBEAgAigCDCACKAIENgIACyACQRBqJAALlQEBAX8jAEEQayIBJAAgASAANgIIAkACfyMAQRBrIgAgASgCCDYCDCAAKAIMKQMYQoCAEINQCwRAIAEoAggoAgAEQCABIAEoAggoAgAQlAFBAXE6AA8MAgsgAUEBOgAPDAELIAEgASgCCEEAQgBBEhAiPgIEIAEgASgCBEEARzoADwsgAS0AD0EBcSEAIAFBEGokACAAC7ABAgF/AX4jAEEgayIDJAAgAyAANgIYIAMgATYCFCADIAI2AhAgAyADKAIQEJEBIgA2AgwCQCAARQRAIANBADYCHAwBCyADKAIMIAMoAhg2AgQgAygCDCADKAIUNgIIIAMoAhRBAEIAQQ4gAygCGBEPACEEIAMoAgwgBDcDGCADKAIMKQMYQgBTBEAgAygCDEI/NwMYCyADIAMoAgw2AhwLIAMoAhwhACADQSBqJAAgAAt/AQF/IwBBIGsiAyQAIAMgADYCGCADIAE3AxAgA0EANgIMIAMgAjYCCAJAIAMpAxBC////////////AFYEQCADKAIIQQRBPRAVIANBfzYCHAwBCyADIAMoAhggAykDECADKAIMIAMoAggQZzYCHAsgAygCHCEAIANBIGokACAAC30AIAJBAUYEQCABIAAoAgggACgCBGusfSEBCwJAIAAoAhQgACgCHEsEQCAAQQBBACAAKAIkEQEAGiAAKAIURQ0BCyAAQQA2AhwgAEIANwMQIAAgASACIAAoAigREABCAFMNACAAQgA3AgQgACAAKAIAQW9xNgIAQQAPC0F/C+ICAQJ/IwBBIGsiAyQAAn8CQAJAQfSXASABLAAAEJkBRQRAQbScAUEcNgIADAELQZgJEBkiAg0BC0EADAELIAJBAEGQARAzIAFBKxCZAUUEQCACQQhBBCABLQAAQfIARhs2AgALAkAgAS0AAEHhAEcEQCACKAIAIQEMAQsgAEEDQQAQBCIBQYAIcUUEQCADIAFBgAhyNgIQIABBBCADQRBqEAQaCyACIAIoAgBBgAFyIgE2AgALIAJB/wE6AEsgAkGACDYCMCACIAA2AjwgAiACQZgBajYCLAJAIAFBCHENACADIANBGGo2AgAgAEGTqAEgAxAODQAgAkEKOgBLCyACQRo2AiggAkEbNgIkIAJBHDYCICACQR02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GCACKAIoKAIAKAIEaksEQCACIAIoAhggAigCKCgCACgCBGo2AhwLIAIoAhwgAigCFEsEQCACIAIoAhQ2AhwLAkAgAigCHCACKAIgTw0AAkAgAigCHEUEQCACKAIkQQRHDQELIAIoAiRFDQAgAigCHCACKAIYIAIoAigoAgAoAgRqRg0BCwwBC0EAIQAgAkEBQQAgAigCJEEERgR/IAIoAhwgAigCGCACKAIoKAIAKAIEakYFQQALQQFxGzYCECACKAIoQQBBACACKAIQEFcgAigCKCgCCCACKAIoKAIUQQRraiACKAIcOgAAIAIoAigoAgggAigCKCgCFEEDa2ogAigCHEEIdjoAACACKAIoKAIIIAIoAigoAhRBAmtqIAIoAhxBf3M6AAAgAigCKCgCCCACKAIoKAIUQQFraiACKAIcQX9zQQh2OgAAIAIoAigoAgAQHSACKAIYBEAgAigCGCACKAIcSwRAIAIgAigCHDYCGAsgAigCKCgCACgCDCACKAIoKAI4IAIoAigoAlxqIAIoAhgQGhogAigCKCgCACIAIAIoAhggACgCDGo2AgwgAigCKCgCACIAIAAoAhAgAigCGGs2AhAgAigCKCgCACIAIAIoAhggACgCFGo2AhQgAigCKCIAIAIoAhggACgCXGo2AlwgAiACKAIcIAIoAhhrNgIcCyACKAIcBEAgAigCKCgCACACKAIoKAIAKAIMIAIoAhwQcxogAigCKCgCACIAIAIoAhwgACgCDGo2AgwgAigCKCgCACIAIAAoAhAgAigCHGs2AhAgAigCKCgCACIAIAIoAhwgACgCFGo2AhQLIAIoAhBFDQELCyACIAIoAgwgAigCKCgCACgCBGs2AgwgAigCDARAAkAgAigCDCACKAIoKAIsTwRAIAIoAihBAjYCsC0gAigCKCgCOCACKAIoKAIAKAIAIAIoAigoAixrIAIoAigoAiwQGhogAigCKCACKAIoKAIsNgJsDAELIAIoAigoAjwgAigCKCgCbGsgAigCDE0EQCACKAIoIgAgACgCbCACKAIoKAIsazYCbCACKAIoKAI4IAIoAigoAjggAigCKCgCLGogAigCKCgCbBAaGiACKAIoKAKwLUECSQRAIAIoAigiACAAKAKwLUEBajYCsC0LCyACKAIoKAI4IAIoAigoAmxqIAIoAigoAgAoAgAg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akECdGovAQI2AhQgAyADKAIQQQFqIgA2AhACQAJAIAAgAygCDE4NACADKAIYIAMoAhRHDQAMAQsCQCADKAIQIAMoAghIBEAgAygCLEH8FGogAygCGEECdGoiACADKAIQIAAvAQBqOwEADAELAkAgAygCGARAIAMoAhggAygCHEcEQCADKAIsIAMoAhhBAnRqQfwUaiIAIAAvAQBBAWo7AQALIAMoAiwiACAAQbwVai8BAEEBajsBvBUMAQsCQCADKAIQQQpMBEAgAygCLCIAIABBwBVqLwEAQQFqOwHAFQwBCyADKAIsIgAgAEHEFWovAQBBAWo7AcQVCwsLIANBADYCECADIAMoAhg2AhwCQCADKAIURQRAIANBigE2AgwgA0EDNgIIDAELAkAgAygCGCADKAIURgRAIANBBjYCDCADQQM2AggMAQsgA0EHNgIMIANBBDYCCAsLCyADIAMoAiBBAWo2AiAMAQsLC6cSAQJ/IwBB0ABrIgMgADYCTCADIAE2AkggAyACNgJEIANBADYCOCADKAJMKAKgLQRAA0AgAyADKAJMKAKkLSADKAI4QQF0ai8BADYCQCADKAJMKAKYLSEAIAMgAygCOCIBQQFqNgI4IAMgACABai0AADYCPAJAIAMoAkBFBEAgAyADKAJIIAMoAjxBAnRqLwECNgIsAkAgAygCTCgCvC1BECADKAIsa0oEQCADIAMoAkggAygCPEECdGovAQA2AiggAygCTCIAIAAvAbgtIAMoAihB//8DcSADKAJMKAK8LXRyOwG4LSADKAJMLwG4LUH/AXEhASADKAJMKAIIIQIgAygCTCIEKAIUIQAgBCAAQQFqNgIUIAAgAmogAToAACADKAJMLwG4LUEIdSEBIAMoAkwoAgghAiADKAJMIgQoAhQhACAEIABBAWo2AhQgACACaiABOgAAIAMoAkwgAygCKEH//wNxQRAgAygCTCgCvC1rdTsBuC0gAygCTCIAIAAoArwtIAMoAixBEGtqNgK8LQwBCyADKAJMIgAgAC8BuC0gAygCSCADKAI8QQJ0ai8BACADKAJMKAK8LXRyOwG4LSADKAJMIgAgAygCLCAAKAK8LWo2ArwtCwwBCyADIAMoAjwtAIBZNgI0IAMgAygCSCADKAI0QYECakECdGovAQI2AiQCQCADKAJMKAK8LUEQIAMoAiRr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AixBLRAgIAMoAixBABAhIAMoAixBABAhIAMoAiwgAykDqAEQLiADKAIsIAMpA6gBEC4gAygCLCADKQOYARAuIAMoAiwgAykDoAEQLiADKAIsQbvTAEEEEEAgAygCLEEAECEgAygCLCADKQOgASADKQOYAXwQLiADKAIsQQEQIQsgAygCLEHA0wBBBBBAIAMoAixBABAhIAMoAiwCfkL//wMgAykDqAFC//8DWg0AGiADKQOoAQunQf//A3EQICADKAIsAn5C//8DIAMpA6gBQv//A1oNABogAykDqAELp0H//wNxECAgAygCLAJ/QX8gAykDmAFC/////w9aDQAaIAMpA5gBpwsQISADKAIsAn9BfyADKQOgAUL/////D1oNABogAykDoAGnCxAhIAMCfyADKAK0AS0AKEEBcQRAIAMoArQBKAIkDAELIAMoArQBKAIgCzYClAEgAygCLAJ/IAMoApQBBEAgAygClAEvAQQMAQtBAAtB//8DcRAgAn8jAEEQayIAIAMoAiw2AgwgACgCDC0AAEEBcUULBEAgAygCtAFBCGpBFEEAEBUgAygCLBAXIANCfzcDuAEMAQsgAygCtAECfyMAQRBrIgAgAygCLDYCDCAAKAIMKAIECwJ+IwBBEGsiACADKAIsNgIMAn4gACgCDC0AAEEBcQRAIAAoAgwpAxAMAQtCAAsLEDZBAEgEQCADKAIsEBcgA0J/NwO4AQwBCyADKAIsEBcgAygClAEEQCADKAK0ASADKAKUASgCACADKAKUAS8BBK0QNkEASARAIANCfzcDuAEMAgsLIAMgAykDmAE3A7gBCyADKQO4ASECIANBwAFqJAAgAgu2BQEBfyMAQTBrIgIkACACIAA2AiggAiABNwMgAkAgAikDICACKAIoKQMwWgRAIAIoAihBCGpBEkEAEBUgAkF/NgIsDAELIAIgAigCKCgCQCACKQMgp0EEdGo2AhwCQCACKAIcKAIABEAgAigCHCgCAC0ABEEBcUUNAQsgAkEANgIsDAELIAIoAhwoAgApA0hCGnxC////////////AFYEQCACKAIoQQhqQQRBFhAVIAJBfzYCLAwBCyACKAIoKAIAIAIoAhwoAgApA0hCGnxBABAoQQBIBEAgAigCKEEIaiACKAIoKAIAEBggAkF/NgIsDAELIAIgAigCKCgCAEIEIAJBGGogAigCKEEIahBBIgA2AhQgAEUEQCACQX82AiwMAQsgAiACKAIUEB47ARIgAiACKAIUEB47ARAgAigCFBBIQQFxRQRAIAIoAhQQFyACKAIoQQhqQRRBABAVIAJBfzYCLAwBCyACKAIUEBcgAi8BEEEASgRAIAIoAigoAgAgAi8BEq1BARAoQQBIBEAgAigCKEEIakEEQbScASgCABAVIAJBfzYCLAwCCyACQQAgAigCKCgCACACLwEQQQAgAigCKEEIahBgNgIIIAIoAghFBEAgAkF/NgIsDAILIAIoAgggAi8BEEGAAiACQQxqIAIoAihBCGoQhgFBAXFFBEAgAigCCBAWIAJBfzYCLAwCCyACKAIIEBYgAigCDARAIAIgAigCDBCFATYCDCACKAIcKAIAKAI0IAIoAgwQhwEhACACKAIcKAIAIAA2AjQLCyACKAIcKAIAQQE6AAQCQCACKAIcKAIERQ0AIAIoAhwoAgQtAARBAXENACACKAIcKAIEIAIoAhwoAgAoAjQ2AjQgAigCHCgCBEEBOgAECyACQQA2AiwLIAIoAiwhACACQTBqJAAgAAsGAEG0nAELjAEBAX8jAEEgayICJAAgAiAANgIYIAIgATYCFCACQQA2AhACQCACKAIURQRAIAJBADYCHAwBCyACIAIoAhQQGTYCDCACKAIMRQRAIAIoAhBBDkEAEBUgAkEANgIcDAELIAIoAgwgAigCGCACKAIUEBoaIAIgAigCDDYCHAsgAigCHCEAIAJBIGokACAACxgAQaicAUIANwIAQbCcAUEANgIAQaicAQuIAQEBfyMAQSBrIgMkACADIAA2AhQgAyABNgIQIAMgAjcDCAJAAkAgAygCFCgCJEEBRgRAIAMpAwhC////////////AFgNAQsgAygCFEEMakESQQAQFSADQn83AxgMAQsgAyADKAIUIAMoAhAgAykDCEELECI3AxgLIAMpAxghAiADQSBqJAAgAgtzAQF/IwBBIGsiASQAIAEgADYCGCABQgg3AxAgASABKAIYKQMQIAEpAxB8NwMIAkAgASkDCCABKAIYKQMQVARAIAEoAhhBADoAACABQX82AhwMAQsgASABKAIYIAEpAwgQLTYCHAsgASgCHBogAUEgaiQACwgAQQFBDBB9CwcAIAAoAigLlgEBAX8jAEEgayICIAA2Ahgg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QRBrIgAgAigCBDYCDAJAIAAoAgwoAgBBBUcNACMAQRBrIgAgAigCBDYCDCAAKAIMKAIEQSxHDQAgAkEANgJMDAILIAIoAkQgAigCBBBEIAJBfzYCTAwBCyACQQE2AkwLIAIoAkwhACACQdAAaiQAIAAL6gEBAX8jAEEwayIDJAAgAyAANgIoIAMgATYCJCADIAI2AiAjAEEQayIAIANBCGoiATYCDCAAKAIMQQA2AgAgACgCDEEANgIEIAAoAgxBADYCCCADIAMoAiggARD7ASIANgIYAkAgAEUEQCADKAIgIANBCGoiABCTASAAEDggA0EANgIsDAELIAMgAygCGCADKAIkIANBCGoQkgEiADYCHCAARQRAIAMoAhgQHCADKAIgIANBCGoiABCTASAAEDggA0EANgIsDAELIANBCGoQOCADIAMoAhw2AiwLIAMoAiwhACADQTBqJAAgAAvIAgEBfyMAQRBrIgEkACABIAA2AgggAUHYABAZNgIEAkAgASgCBEUEQCABKAIIQQ5BABAVIAFBADYCDAwBCyABKAIIEIIDIQAgASgCBCAANgJQIABFBEAgASgCBBAWIAFBADYCDAwBCyABKAIEQQA2AgAgASgCBEEANgIEIwBBEGsiACABKAIEQQhqNgIMIAAoAgxBADYCACAAKAIMQQA2AgQgACgCDEEANgIIIAEoAgRBADYCGCABKAIEQQA2AhQgASgCBEEANgIcIAEoAgRBADYCJCABKAIEQQA2AiAgASgCBEEAOgAoIAEoAgRCADcDOCABKAIEQgA3AzAgASgCBEEANgJAIAEoAgRBADYCSCABKAIEQQA2AkQgASgCBEEANgJMIAEoAgRBADYCVCABIAEoAgQ2AgwLIAEoAgwhACABQRBqJAAgAAuBAQEBfyMAQSBrIgIkACACIAA2AhggAkIANwMQIAJCfzcDCCACIAE2AgQCQAJAIAIoAhgEQCACKQMIQn9ZDQELIAIoAgRBEkEAEBUgAkEANgIcDAELIAIgAigCGCACKQMQIAIpAwggAigCBBD/ATYCHAsgAigCHCEAIAJBIGokACAAC80BAQJ/IwBBIGsiASQAIAEgADYCGCABQQA6ABcgAUGAgCA2AgwCQCABLQAXQQFxBEAgASABKAIMQQJyNgIMDAELIAEgASgCDDYCDAsgASgCGCEAIAEoAgwh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AUEJSyEEIAMhASAEDQALDwsgA0EwOgAAIABBADoADws3AQF/IwBBIGsiASQAAn9BASAAIAFBCGoQCCIARQ0AGkG0nAEgADYCAEEACyEAIAFBIGokACAACyABAn8gABAsQQFqIgEQGSICRQRAQQAPCyACIAAgARAaC6UBAQF/IwBBIGsiAiAANgIUIAIgATYCEAJAIAIoAhRFBEAgAkJ/NwMYDAELIAIoAhBBCHEEQCACIAIoAhQpAzA3AwgDQEEAIQAgAikDCEIAVgR/IAIoAhQoAkAgAikDCEIBfadBBHRqKAIARQVBAAtBAXEEQCACIAIpAwhCf3w3AwgMAQsLIAIgAikDCDcDGAwBCyACIAIoAhQpAzA3AxgLIAIpAxgL8gEBAX8jAEEgayIDJAAgAyAANgIUIAMgATYCECADIAI3AwgCQCADKAIURQRAIANCfzcDGAwBCyADKAIUKAIEBEAgA0J/NwMYDAELIAMpAwhC////////////AFYEQCADKAIUQQRqQRJBABAVIANCfzcDGAwBCwJAIAMoAhQtABBBAXFFBEAgAykDCFBFDQELIANCADcDGAwBCyADIAMoAhQoAhQgAygCECADKQMIEC8iAjcDACACQgBTBEAgAygCFEEEaiADKAIUKAIUEBggA0J/NwMYDAELIAMgAykDADcDGAsgAykDGCECIANBIGokACACC0cBAX8jAEEgayIDJAAgAyAANgIcIAMgATcDECADIAI2AgwgAygCHCADKQMQIAMoAgwgAygCHCgCHBCfASEAIANBIGokACAAC38CAX8BfiMAQSBrIgMkACADIAA2AhggAyABNgIUIAMgAjYCECADIAMoAhggAygCFCADKAIQEG4iBDcDCAJAIARCAFMEQCADQQA2AhwMAQsgAyADKAIYIAMpAwggAygCECADKAIYKAIcEJ8BNgIcCyADKAIcIQAgA0EgaiQAIAALqgEBAX8jAEEQayIBJAAgASAANgIIIAFBGBAZIgA2AgQCQCAARQRAIAEoAghBCGpBDkEAEBUgAUEANgIMDAELIAEoAgQgASgCCDYCACMAQRBrIgAgASgCBEEEajYCDCAAKAIMQQA2AgAgACgCDEEANgIEIAAoAgxBADYCCCABKAIEQQA6ABAgASgCBEEANgIUIAEgASgCBDYCDAsgASgCDCEAIAFBEGok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QdAAaiADQaABahBwIARFDQAaIABBAEEAIAAoAiQRAQAaIABBADYCMCAAIAQ2AiwgAEEANgIcIABBADYCECAAKAIUGiAAQQA2AhRBAAsaIAAgACgCACAFcjYCACACRQ0ACyADQdABaiQACy8AIAECfyACKAJMQX9MBEAgACABIAIQcQwBCyAAIAEgAhBxCyIARgRAIAEPCyAAC1kBAX8gACAALQBKIgFBf2ogAXI6AEogACgCACIBQQhxBEAgACABQSByNgIAQX8PCyAAQgA3AgQgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCEEEACwYAQfSgAQsGAEHwoAELBgBB6KABC9kDAgJ/An4jAEEgayICJAACQCABQv///////////wCDIgVCgICAgICAwP9DfCAFQoCAgICAgMCAvH98VARAIAFCBIYgAEI8iIQhBCAAQv//////////D4MiAEKBgICAgICAgAhaBEAgBEKBgICAgICAgMAAfCEEDAILIARCgICAgICAgIBAfSEEIABCgICAgICAgIAIhUIAUg0BIARCAYMgBHwhBAwBCyAAUCAFQoCAgICAgMD//wBUIAVCgICAgICAwP//AFEbRQRAIAFCBIYgAEI8iIRC/////////wODQoCAgICAgID8/wCEIQQMAQtCgICAgICAgPj/ACEEIAVC////////v//DAFYNAEIAIQQgBUIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qELQCIAIgACAEQYH4ACADaxCzAiACKQMIQgSGIAIpAwAiAEI8iIQhBCACKQMQIAIpAxiEQgBSrSAAQv//////////D4OEIgBCgYCAgICAgIAIWgRAIARCAXwhBAwBCyAAQoCAgICAgICACIVCAFINACAEQgGDIAR8IQQLIAJBIGokACAEIAFCgICAgICAgICAf4OEvwtQAQF+AkAgA0HAAHEEQCACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAtQAQF+AkAgA0HAAHEEQCABIANBQGqthiECQgAhAQwBCyADRQ0AIAIgA60iBIYgAUHAACADa62IhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAuLAgACQCAABH8gAUH/AE0NAQJAQZCaASgCACgCAEUEQCABQYB/cUGAvwNGDQMMAQsgAUH/D00EQCAAIAFBP3FBgAFyOgABIAAgAUEGdkHAAXI6AABBAg8LIAFBgLADT0EAIAFBgEBxQYDAA0cbRQRAIAAgAUE/cUGAAXI6AAIgACABQQx2QeABcjoAACAAIAFBBnZBP3FBgAFyOgABQQMPCyABQYCAfGpB//8/TQRAIAAgAUE/cUGAAXI6AAMgACABQRJ2QfABcjoAACAAIAFBBnZBP3FBgAFyOgACIAAgAUEMdkE/cUGAAXI6AAFBBA8LC0G0nAFBGTYCAEF/BUEBCw8LIAAgAToAAEEBC74CAQF/IwBBwMAAayIDJAAgAyAANgK4QCADIAE2ArRAIAMgAjcDqEACQCADKAK0QBBJQQBIBEAgAygCuEBBCGogAygCtEAQGCADQX82ArxADAELIANBADYCDCADQgA3AxADQAJAIAMgAygCtEAgA0EgakKAwAAQLyICNwMYIAJCAFcNACADKAK4QCADQSBqIAMpAxgQNkEASARAIANBfzYCDAUgAykDGEKAwABSDQIgAygCuEAoAlRFDQIgAykDqEBCAFcNAiADIAMpAxggAykDEHw3AxAgAygCuEAoAlQgAykDELkgAykDqEC5oxBYDAILCwsgAykDGEIAUwRAIAMoArhAQQhqIAMoArRAEBggA0F/NgIMCyADKAK0QBAyGiADIAMoAgw2ArxACyADKAK8QCEAIANBwMAAaiQAIAALqgEBAX8jAEEwayIDJAAgAyAANgIoIAMgATYCJCADIAI3AxggAyADKAIoKAIAEDUiAjcDEAJAIAJCAFMEQCADQX82AiwMAQsgAyADKAIoIAMoAiQgAykDGBDGASICNwMAIAJCAFMEQCADQX82AiwMAQsgAyADKAIoKAIAEDUiAjcDCCACQgBTBEAgA0F/NgIsDAELIANBADYCLAsgAygCLCEAIANBMGokACAAC/4BAQF/IwBBoMAAayICJAAgAiAANgKYQCACIAE3A5BAIAIgAikDkEC6OQMAAkADQCACKQOQQEIAVgRAIAICfkKAwAAgAikDkEBCgMAAVg0AGiACKQOQQAs+AgwgAigCmEAoAgAgAkEQaiACKAIMrSACKAKYQEEIahBhQQBIBEAgAkF/NgKcQAwDCyACKAKYQCACQRBqIAIoAgytEDZBAEgEQCACQX82ApxADAMFIAIgAikDkEAgAjUCDH03A5BAIAIoAphAKAJUIAIrAwAgAikDkEC6oSACKwMAoxBYDAILAAsLIAJBADYCnEALIAIoApxAIQAgAkGgwABqJAAgAAvnEQIBfwF+IwBBoAFrIgMkACADIAA2ApgBIAMgATYClAEgAyACNgKQAQJAIAMoApQBIANBOGoQOUEASARAIAMoApgBQQhqIAMoApQBEBggA0F/NgKcAQwBCyADKQM4QsAAg1AEQCADIAMpAzhCwACENwM4IANBADsBaAsCQAJAIAMoApABKAIQQX9HBEAgAygCkAEoAhBBfkcNAQsgAy8BaEUNACADKAKQASADLwFoNgIQDAELAkACQCADKAKQASgCEA0AIAMpAzhCBINQDQAgAyADKQM4QgiENwM4IAMgAykDUDcDWAwBCyADIAMpAzhC9////w+DNwM4CwsgAykDOEKAAYNQBEAgAyADKQM4QoABhDcDOCADQQA7AWoLIANBgAI2AiQCQCADKQM4QgSDUARAIAMgAygCJEGACHI2AiQgA0J/NwNwDAELIAMoApABIAMpA1A3AyggAyADKQNQNwNwAkAgAykDOEIIg1AEQAJAAkACQAJAAkACfwJAIAMoApABKAIQQX9HBEAgAygCkAEoAhBBfkcNAQtBCAwBCyADKAKQASgCEAtB//8DcQ4NAgMDAwMDAwMBAwMDAAMLIANClMLk8w83AxAMAwsgA0KDg7D/DzcDEAwCCyADQv////8PNwMQDAELIANCADcDEAsgAykDUCADKQMQVgRAIAMgAygCJEGACHI2AiQLDAELIAMoApABIAMpA1g3AyALCyADIAMoApgBKAIAEDUiBDcDiAEgBEIAUwRAIAMoApgBQQhqIAMoApgBKAIAEBggA0F/NgKcAQwBCyADKAKQASIAIAAvAQxB9/8DcTsBDCADIAMoApgBIAMoApABIAMoAiQQXiIANgIoIABBAEgEQCADQX82ApwBDAELIAMgAy8BaAJ/AkAgAygCkAEoAhBBf0cEQCADKAKQASgCEEF+Rw0BC0EIDAELIAMoApABKAIQC0H//wNxRzoAIiADIAMtACJBAXEEfyADLwFoQQBHBUEAC0EBcToAISADIAMvAWgEfyADLQAhBUEBC0EBcToAICADIAMtACJBAXEEfyADKAKQASgCEEEARwVBAAtBAXE6AB8gAwJ/QQEgAy0AIkEBcQ0AGkEBIAMoApABKAIAQYABcQ0AGiADKAKQAS8BUiADLwFqRwtBAXE6AB4gAyADLQAeQQFxBH8gAy8BakEARwVBAAtBAXE6AB0gAyADLQAeQQFxBH8gAygCkAEvAVJBAEcFQQALQQFxOgAcIAMgAygClAE2AjQjAEEQayIAIAMoAjQ2AgwgACgCDCIAIAAoAjBBAWo2AjAgAy0AHUEBcQRAIAMgAy8BakEAEHciADYCDCAARQRAIAMoApgBQQhqQRhBABAVIAMoAjQQHCADQX82ApwBDAILIAMgAygCmAEgAygCNCADLwFqQQAgAygCmAEoAhwgAygCDBEGACIANgIwIABFBEAgAygCNBAcIANBfzYCnAEMAgsgAygCNBAcIAMgAygCMDYCNAsgAy0AIUEBcQRAIAMgAygCmAEgAygCNCADLwFoEKsBIgA2AjAgAEUEQCADKAI0EBwgA0F/NgKcAQwCCyADKAI0EBwgAyADKAIwNgI0CyADLQAgQQFxBEAgAyADKAKYASADKAI0QQAQqgEiADYCMCAARQRAIAMoAjQQHCADQX82ApwBDAILIAMoAjQQHCADIAMoAjA2AjQLIAMtAB9BAXEEQCADIAMoApgBIAMoAjQgAygCkAEoAhAgAygCkAEvAVAQwgIiADYCMCAARQRAIAMoAjQQHCADQX82ApwBDAILIAMoAjQQHCADIAMoAjA2AjQLIAMtABxBAXEEQCADQQA2AgQCQCADKAKQASgCVARAIAMgAygCkAEoAlQ2AgQMAQsgAygCmAEoAhwEQCADIAMoApgBKAIcNgIECwsgAyADKAKQAS8BUkEBEHciADYCCCAARQRAIAMoApgBQQhqQRhBABAVIAMoAjQQHCADQX82ApwBDAILIAMgAygCmAEgAygCNCADKAKQAS8BUkEBIAMoAgQgAygCCBEGACIANgIwIABFBEAgAygCNBAcIANBfzYCnAEMAgsgAygCNBAcIAMgAygCMDYCNAsgAyADKAKYASgCABA1IgQ3A4ABIARCAFMEQCADKAKYAUEIaiADKAKYASgCABAYIANBfzYCnAEMAQsgAyADKAKYASADKAI0IAMpA3AQtgI2AiwgAygCNCADQThqEDlBAEgEQCADKAKYAUEIaiADKAI0EBggA0F/NgIsCyADIAMoAjQQvAIiADoAIyAAQRh0QRh1QQBIBEAgAygCmAFBCGogAygCNBAYIANBfzYCLAsgAygCNBAcIAMoAixBAEgEQCADQX82ApwBDAELIAMgAygCmAEoAgAQNSIENwN4IARCAFMEQCADKAKYAUEIaiADKAKYASgCABAYIANBfzYCnAEMAQsgAygCmAEoAgAgAykDiAEQqAFBAEgEQCADKAKYAUEIaiADKAKYASgCABAYIANBfzYCnAEMAQsgAykDOELkAINC5ABSBEAgAygCmAFBCGpBFEEAEBUgA0F/NgKcAQwBCyADKAKQASgCAEEgcUUEQAJAIAMpAzhCEINCAFIEQCADKAKQASADKAJgNgIUDAELIAMoApABQRRqEAEaCwsgAygCkAEgAy8BaDYCECADKAKQASADKAJkNgIYIAMoApABIAMpA1A3AyggAygCkAEgAykDeCADKQOAAX03AyAgAygCkAEgAygCkAEvAQxB+f8DcSADLQAjQQF0cjsBDCADKAKQASADKAIkQYAIcUEARxCKAyADIAMoApgBIAMoApABIAMoAiQQXiIANgIsIABBAEgEQCADQX82ApwBDAELIAMoAiggAygCLEcEQCADKAKYAUEIakEUQQAQFSADQX82ApwBDAELIAMoApgBKAIAIAMpA3gQqAFBAEgEQCADKAKYAUEIaiADKAKYASgCABAYIANBfzYCnAEMAQsgA0EANgKcAQsgAygCnAEhACADQaABaiQAIAALrwIBAX8jAEEgayICIAA2AhwgAiABNgIYIAJBADYCFCACQgA3AwACQCACKAIcLQAoQQFxRQRAIAIoAhwoAhggAigCHCgCFEYNAQsgAkEBNgIUCyACQgA3AwgDQCACKQMIIAIoAhwpAzBUBEACQAJAIAIoAhwoAkAgAikDCKdBBHRqKAIIDQAgAigCHCgCQCACKQMIp0EEdGotAAxBAXENACACKAIcKAJAIAIpAwinQQR0aigCBEUNASACKAIcKAJAIAIpAwinQQR0aigCBCgCAEUNAQsgAkEBNgIUCyACKAIcKAJAIAIpAwinQQR0ai0ADEEBcUUEQCACIAIpAwBCAXw3AwALIAIgAikDCEIBfDcDCAwBCwsgAigCGARAIAIoAhggAikDADcDAAsg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BEAgASgCGEEGNgIkCyABIAEoAhgoAihBAUHQNyABKAIYKAIgEQEANgIEIAEoAgRFBEAgAUF8NgIcDAELIAEoAhggASgCBDYCHCABKAIEIAEoAhg2AgAgASgCBEEANgI4IAEoAgRBtP4ANgIEIAEgASgCGCABKAIUENICNgIIIAEoAggEQCABKAIYKAIoIAEoAgQgASgCGCgCJBEEACABKAIYQQA2AhwLIAEgASgCCDYCHAsgASgCHCEAIAFBIGokACAAC60CAQF/IwBBIGsiAiQAIAIgADYCGCACIAE2AhQCQCACKAIYEEsEQCACQX42AhwMAQsgAiACKAIYKAIcNgIMAkAgAigCFEEASARAIAJBADYCECACQQAgAigCFGs2AhQMAQsgAiACKAIUQQR1QQVqNgIQIAIoAhRBMEgEQCACIAIoAhRBD3E2AhQLCwJAIAIoAhRFDQAgAigCFEEITgRAIAIoAhRBD0wNAQsgAkF+NgIcDAELAkAgAigCDCgCOEUNACACKAIMKAIoIAIoAhRGDQAgAigCGCgCKCACKAIMKAI4IAIoAhgoAiQRBAAgAigCDEEANgI4CyACKAIMIAIoAhA2AgwgAigCDCACKAIUNgIoIAIgAigCGBDTAjYCHAsgAigCHCEAIAJBIGokACAAC3IBAX8jAEEQayIBJAAgASAANgIIAkAgASgCCBBLBEAgAUF+NgIMDAELIAEgASgCCCgCHDYCBCABKAIEQQA2AiwgASgCBEEANgIwIAEoAgRBADYCNCABIAEoAggQ1AI2AgwLIAEoAgwhACABQRBqJAAgAAubAgEBfyMAQRBrIgEkACABIAA2AggCQCABKAIIEEsEQCABQX42AgwMAQsgASABKAIIKAIcNgIEIAEoAgRBADYCICABKAIIQQA2AhQgASgCCEEANgIIIAEoAghBADYCGCABKAIEKAIMBEAgASgCCCABKAIEKAIMQQFxNgIwCyABKAIEQbT+ADYCBCABKAIEQQA2AgggASgCBEEANgIQIAEoAgRBgIACNgIYIAEoAgRBADYCJCABKAIEQQA2AjwgASgCBEEANgJAIAEoAgQgASgCBEG0CmoiADYCcCABKAIEIAA2AlQgASgCBCAANgJQIAEoAgRBATYCxDcgASgCBEF/NgLINyABQQA2AgwLIAEoAgwhACABQRBqJAAgAAuI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AgxrajYCACACKAIMIAIoAghJBEAgAiACKAIIIAIoAgxrNgIIA0AgAiACKAIAIgBBAWo2AgAgAC0AACEAIAIgAigCSCIBQQFqNgJIIAEgADoAACACIAIoAgxBf2oiADYCDCAADQALIAIgAigCSCACKAIEazYCAAsLCwNAIAIoAghBAk1FBEAgAiACKAIAIgBBAWo2AgAgAC0AACEAIAIgAigCSCIBQQFqNgJIIAEgADoAACACIAIoAgAiAEEBajYCACAALQAAIQAgAiACKAJIIgFBAWo2AkggASAAOgAAIAIgAigCACIAQQFqNgIAIAAtAAAhACACIAIoAkgiAUEBajYCSCABIAA6AAAgAiACKAIIQQNrNgIIDAELCwwBCyACIAIoAkggAigCBGs2AgADQCACIAIoAgAiAEEBajYCACAALQAAIQAgAiACKAJIIgFBAWo2AkggASAAOgAAIAIgAigCACIAQQFqNgIAIAAtAAAhACACIAIoAkgiAUEBajYCSCABIAA6AAAgAiACKAIAIgBBAWo2AgAgAC0AACEAIAIgAigCSCIBQQFqNgJIIAEgADoAACACIAIoAghBA2s2AgggAigCCEECSw0ACwsgAigCCARAIAIgAigCACIAQQFqNgIAIAAtAAAhACACIAIoAkgiAUEBajYCSCABIAA6AAAgAigCCEEBSwRAIAIgAigCACIAQQFqNgIAIAAtAAAhACACIAIoAkgiAUEBajYCSCABIAA6AAALCwwCCyACKAIMQcAAcUUEQCACQRBqIAIoAiAgAi8BEiACKAIsQQEgAigCDHRBAWtxakECdGooAQA2AQAMAQsLIAIoAlxBzu0ANgIYIAIoAlRB0f4ANgIEDAQLDAILIAIoAgxBwABxRQRAIAJBEGogAigCJCACLwESIAIoAixBASACKAIMdEEBa3FqQQJ0aigBADYBAAwBCwsgAigCDEEgcQRAIAIoAlRBv/4ANgIEDAILIAIoAlxB5O0ANgIYIAIoAlRB0f4ANgIEDAELQQAhACACKAJQIAIoAkxJBH8gAigCSCACKAJASQVBAAtBAXENAQsLIAIgAigCKEEDdjYCCCACIAIoAlAgAigCCGs2AlAgAiACKAIoIAIoAghBA3RrNgIoIAIgAigCLEEBIAIoAih0QQFrcTYCLCACKAJcIAIoAlA2AgAgAigCXCACKAJINgIMIAIoAlwCfyACKAJQIAIoAkxJBEAgAigCTCACKAJQa0EFagwBC0EFIAIoAlAgAigCTGtrCzYCBCACKAJcAn8gAigCSCACKAJASQRAIAIoAkAgAigCSGtBgQJqDAELQYECIAIoAkggAigCQGtrCzYCECACKAJUIAIoAiw2AjwgAigCVCACKAIoNgJAC8EQAQJ/IwBBIGsiAiQAIAIgADYCGCACIAE2AhQCQANAAkAgAigCGCgCdEGGAkkEQCACKAIYEFYCQCACKAIYKAJ0QYYCTw0AIAIoAhQNACACQQA2AhwMBAsgAigCGCgCdEUNAQsgAkEANgIQIAIoAhgoAnRBA08EQCACKAIYIAIoAhgoAlQgAigCGCgCOCACKAIYKAJsQQJqai0AACACKAIYKAJIIAIoAhgoAlh0c3E2AkggAigCGCgCQCACKAIYKAJsIAIoAhgoAjRxQQF0aiACKAIYKAJEIAIoAhgoAkhBAXRqLwEAIgA7AQAgAiAAQf//A3E2AhAgAigCGCgCRCACKAIYKAJIQQF0aiACKAIYKAJsOwEACyACKAIYIAIoAhgoAmA2AnggAigCGCACKAIYKAJwNgJkIAIoAhhBAjYCYAJAIAIoAhBFDQAgAigCGCgCeCACKAIYKAKAAU8NACACKAIYKAJsIAIoAhBrIAIoAhgoAixBhgJrSw0AIAIoAhggAigCEBCxASEAIAIoAhggADYCYAJAIAIoAhgoAmBBBUsNACACKAIYKAKIAUEBRwRAIAIoAhgoAmBBA0cNASACKAIYKAJsIAIoAhgoAnBrQYAgTQ0BCyACKAIYQQI2AmALCwJAAkAgAigCGCgCeEEDSQ0AIAIoAhgoAmAgAigCGCgCeEsNACACIAIoAhgiACgCbCAAKAJ0akF9ajYCCCACIAIoAhgoAnhBfWo6AAcgAiACKAIYIgAoAmwgACgCZEF/c2o7AQQgAigCGCIAKAKkLSAAKAKgLUEBdGogAi8BBDsBACACLQAHIQEgAigCGCIAKAKYLSEDIAAgACgCoC0iAEEBajYCoC0gACADaiABOgAAIAIgAi8BBEF/ajsBBCACKAIYIAItAAdBgNkAai0AAEECdGpBmAlqIgAgAC8BAEEBajsBACACKAIYQYgTagJ/IAIvAQRBgAJIBEAgAi8BBC0AgFUMAQsgAi8BBEEHdUGAAmotAIBVC0ECdGoiACAALwEAQQFqOwEAIAIgAigCGCgCoC0gAigCGCgCnC1BAWtGNgIMIAIoAhgiACAAKAJ0IAIoAhgoAnhBAWtrNgJ0IAIoAhgiACAAKAJ4QQJrNgJ4A0AgAigCGCIBKAJsQQFqIQAgASAANgJsIAAgAigCCE0EQCACKAIYIAIoAhgoAlQgAigCGCgCOCACKAIYKAJsQQJqai0AACACKAIYKAJIIAIoAhgoAlh0c3E2AkggAigCGCgCQCACKAIYKAJsIAIoAhgoAjRxQQF0aiACKAIYKAJEIAIoAhgoAkhBAXRqLwEAIgA7AQAgAiAAQf//A3E2AhAgAigCGCgCRCACKAIYKAJIQQF0aiACKAIYKAJsOwEACyACKAIYIgEoAnhBf2ohACABIAA2AnggAA0ACyACKAIYQQA2AmggAigCGEECNgJgIAIoAhgiACAAKAJsQQFqNgJsIAIoAgwEQCACKAIYAn8gAigCGCgCXEEATgRAIAIoAhgoAjggAigCGCgCXGoMAQtBAAsgAigCGCgCbCACKAIYKAJca0EAECkgAigCGCACKAIYKAJsNgJcIAIoAhgoAgAQHSACKAIYKAIAKAIQRQRAIAJBADYCHAwGCwsMAQsCQCACKAIYKAJoBEAgAiACKAIYIgAoAjggACgCbGpBf2otAAA6AAMgAigCGCIAKAKkLSAAKAKgLUEBdGpBADsBACACLQADIQEgAigCGCIAKAKYLSEDIAAgACgCoC0iAEEBajYCoC0gACADaiABOgAAIAIoAhggAi0AA0ECdGoiACAALwGUAUEBajsBlAEgAiACKAIYKAKgLSACKAIYKAKcLUEBa0Y2AgwgAigCDARAIAIoAhgCfyACKAIYKAJcQQBOBEAgAigCGCgCOCACKAIYKAJcagwBC0EACyACKAIYKAJsIAIoAhgoAlxrQQAQKSACKAIYIAIoAhgoAmw2AlwgAigCGCgCABAdCyACKAIYIgAgACgCbEEBajYCbCACKAIYIgAgACgCdEF/ajYCdCACKAIYKAIAKAIQRQRAIAJBADYCHAwGCwwBCyACKAIYQQE2AmggAigCGCIAIAAoAmxBAWo2AmwgAigCGCIAIAAoAnRBf2o2AnQLCwwBCwsgAigCGCgCaARAIAIgAigCGCIAKAI4IAAoAmxqQX9qLQAAOgACIAIoAhgiACgCpC0gACgCoC1BAXRqQQA7AQAgAi0AAiEBIAIoAhgiACgCmC0hAyAAIAAoAqAtIgBBAWo2AqAtIAAgA2ogAToAACACKAIYIAItAAJBAnRqIgAgAC8BlAFBAWo7AZQBIAIgAigCGCgCoC0gAigCGCgCnC1BAWtGNgIMIAIoAhhBADYCaAsgAigCGAJ/IAIoAhgoAmxBAkkEQCACKAIYKAJsDAELQQILNgK0LSACKAIUQQRGBEAgAigCGAJ/IAIoAhgoAlxBAE4EQCACKAIYKAI4IAIoAhgoAlxqDAELQQALIAIoAhgoAmwgAigCGCgCXGtBARApIAIoAhggAigCGCgCbDYCXCACKAIYKAIAEB0gAigCGCgCACgCEEUEQCACQQI2AhwMAgsgAkEDNgIcDAELIAIoAhgoAqAtBEAgAigCGAJ/IAIoAhgoAlxBAE4EQCACKAIYKAI4IAIoAhgoAlxqDAELQQALIAIoAhgoAmwgAigCGCgCXGtBABApIAIoAhggAigCGCgCbDYCXCACKAIYKAIAEB0gAigCGCgCACgCEEUEQCACQQA2AhwMAgsLIAJBATYCHAsgAigCHCEAIAJBIGokACAAC5UNAQJ/IwBBIGsiAiQAIAIgADYCGCACIAE2AhQCQANAAkAgAigCGCgCdEGGAkkEQCACKAIYEFYCQCACKAIYKAJ0QYYCTw0AIAIoAhQNACACQQA2AhwMBAsgAigCGCgCdEUNAQsgAkEANgIQIAIoAhgoAnRBA08EQCACKAIYIAIoAhgoAlQgAigCGCgCOCACKAIYKAJsQQJqai0AACACKAIYKAJIIAIoAhgoAlh0c3E2AkggAigCGCgCQCACKAIYKAJsIAIoAhgoAjRxQQF0aiACKAIYKAJEIAIoAhgoAkhBAXRqLwEAIgA7AQAgAiAAQf//A3E2AhAgAigCGCgCRCACKAIYKAJIQQF0aiACKAIYKAJsOwEACwJAIAIoAhBFDQAgAigCGCgCbCACKAIQayACKAIYKAIsQYYCa0sNACACKAIYIAIoAhAQsQEhACACKAIYIAA2AmALAkAgAigCGCgCYEEDTwRAIAIgAigCGCgCYEF9ajoACyACIAIoAhgiACgCbCAAKAJwazsBCCACKAIYIgAoAqQtIAAoAqAtQQF0aiACLwEIOwEAIAItAAshASACKAIYIgAoApgtIQMgACAAKAKgLSIAQQFqNgKgLSAAIANqIAE6AAAgAiACLwEIQX9qOwEIIAIoAhggAi0AC0GA2QBqLQAAQQJ0akGYCWoiACAALwEAQQFqOwEAIAIoAhhBiBNqAn8gAi8BCEGAAkgEQCACLwEILQCAVQwBCyACLwEIQQd1QYACai0AgFULQQJ0aiIAIAAvAQBBAWo7AQAgAiACKAIYKAKgLSACKAIYKAKcLUEBa0Y2AgwgAigCGCIAIAAoAnQgAigCGCgCYGs2AnQCQAJAIAIoAhgoAmAgAigCGCgCgAFLDQAgAigCGCgCdEEDSQ0AIAIoAhgiACAAKAJgQX9qNgJgA0AgAigCGCIAIAAoAmxBAWo2AmwgAigCGCACKAIYKAJUIAIoAhgoAjggAigCGCgCbEECamotAAAgAigCGCgCSCACKAIYKAJYdHNxNgJIIAIoAhgoAkAgAigCGCgCbCACKAIYKAI0cUEBdGogAigCGCgCRCACKAIYKAJIQQF0ai8BACIAOwEAIAIgAEH//wNxNgIQIAIoAhgoAkQgAigCGCgCSEEBdGogAigCGCgCbDsBACACKAIYIgEoAmBBf2ohACABIAA2AmAgAA0ACyACKAIYIgAgACgCbEEBajYCbAwBCyACKAIYIgAgAigCGCgCYCAAKAJsajYCbCACKAIYQQA2AmAgAigCGCACKAIYKAI4IAIoAhgoAmxqLQAANgJIIAIoAhggAigCGCgCVCACKAIYKAI4IAIoAhgoAmxBAWpqLQAAIAIoAhgoAkggAigCGCgCWHRzcTYCSAsMAQsgAiACKAIYIgAoAjggACgCbGotAAA6AAcgAigCGCIAKAKkLSAAKAKgLUEBdGpBADsBACACLQAHIQEgAigCGCIAKAKYLSEDIAAgACgCoC0iAEEBajYCoC0gACADaiABOgAAIAIoAhggAi0AB0ECdGoiACAALwGUAUEBajsBlAEgAiACKAIYKAKgLSACKAIYKAKcLUEBa0Y2AgwgAigCGCIAIAAoAnRBf2o2AnQgAigCGCIAIAAoAmxBAWo2AmwLIAIoAgwEQCACKAIYAn8gAigCGCgCXEEATgRAIAIoAhgoAjggAigCGCgCXGoMAQtBAAsgAigCGCgCbCACKAIYKAJca0EAECkgAigCGCACKAIYKAJsNgJcIAIoAhgoAgAQHSACKAIYKAIAKAIQRQRAIAJBADYCHAwECwsMAQsLIAIoAhgCfyACKAIYKAJsQQJJBEAgAigCGCgCbAwBC0ECCzYCtC0gAigCFEEERgRAIAIoAhgCfyACKAIYKAJcQQBOBEAgAigCGCgCOCACKAIYKAJcagwBC0EACyACKAIYKAJsIAIoAhgoAlxrQQEQKSACKAIYIAIoAhgoAmw2AlwgAigCGCgCABAdIAIoAhgoAgAoAhBFBEAgAkECNgIcDAILIAJBAzYCHAwBCyACKAIYKAKgLQRAIAIoAhgCfyACKAIYKAJcQQBOBEAgAigCGCgCOCACKAIYKAJcagwBC0EACyACKAIYKAJsIAIoAhgoAlxrQQAQKSACKAIYIAIoAhgoAmw2AlwgAigCGCgCABAdIAIoAhgoAgAoAhBFBEAgAkEANgIcDAILCyACQQE2AhwLIAIoAhwhACACQSBqJAAgAAu7DAECfyMAQTBrIgIkACACIAA2AiggAiABNgIkAkADQAJAIAIoAigoAnRBggJNBEAgAigCKBBWAkAgAigCKCgCdEGCAksNACACKAIkDQAgAkEANgIsDAQLIAIoAigoAnRFDQELIAIoAihBADYCYAJAIAIoAigoAnRBA0kNACACKAIoKAJsQQBNDQAgAiACKAIoKAI4IAIoAigoAmxqQX9qNgIYIAIgAigCGC0AADYCHCACKAIcIQAgAiACKAIYIgFBAWo2AhgCQCABLQABIABHDQAgAigCHCEAIAIgAigCGCIBQQFqNgIYIAEtAAEgAEcNACACKAIcIQAgAiACKAIYIgFBAWo2AhggAS0AASAARw0AIAIgAigCKCgCOCACKAIoKAJsakGCAmo2AhQDQCACKAIcIQEgAiACKAIYIgNBAWo2AhgCf0EAIAMtAAEgAUcNABogAigCHCEBIAIgAigCGCIDQQFqNgIYQQAgAy0AASABRw0AGiACKAIcIQEgAiACKAIYIgNBAWo2AhhBACADLQABIAFHDQAaIAIoAhwhASACIAIoAhgiA0EBajYCGEEAIAMtAAEgAUcNABogAigCHCEBIAIgAigCGCIDQQFqNgIYQQAgAy0AASABRw0AGiACKAIcIQEgAiACKAIYIgNBAWo2AhhBACADLQABIAFHDQAaIAIoAhwhASACIAIoAhgiA0EBajYCGEEAIAMtAAEgAUcNABogAigCHCEBIAIgAigCGCIDQQFqNgIYQQAgAy0AASABRw0AGiACKAIYIAIoAhRJC0EBcQ0ACyACKAIoQYICIAIoAhQgAigCGGtrNgJgIAIoAigoAmAgAigCKCgCdEsEQCACKAIoIAIoAigoAnQ2AmALCwsCQCACKAIoKAJgQQNPBEAgAiACKAIoKAJgQX1qOgATIAJBATsBECACKAIoIgAoAqQtIAAoAqAtQQF0aiACLwEQOwEAIAItABMhASACKAIoIgAoApgtIQMgACAAKAKgLSIAQQFqNgKgLSAAIANqIAE6AAAgAiACLwEQQX9qOwEQIAIoAiggAi0AE0GA2QBqLQAAQQJ0akGYCWoiACAALwEAQQFqOwEAIAIoAihBiBNqAn8gAi8BEEGAAkgEQCACLwEQLQCAVQwBCyACLwEQQQd1QYACai0AgFULQQJ0aiIAIAAvAQBBAWo7AQAgAiACKAIoKAKgLSACKAIoKAKcLUEBa0Y2AiAgAigCKCIAIAAoAnQgAigCKCgCYGs2AnQgAigCKCIAIAIoAigoAmAgACgCbGo2AmwgAigCKEEANgJgDAELIAIgAigCKCIAKAI4IAAoAmxqLQAAOgAPIAIoAigiACgCpC0gACgCoC1BAXRqQQA7AQAgAi0ADyEBIAIoAigiACgCmC0hAyAAIAAoAqAtIgBBAWo2AqAtIAAgA2ogAToAACACKAIoIAItAA9BAnRqIgAgAC8BlAFBAWo7AZQBIAIgAigCKCgCoC0gAigCKCgCnC1BAWtGNgIgIAIoAigiACAAKAJ0QX9qNgJ0IAIoAigiACAAKAJsQQFqNgJsCyACKAIgBEAgAigCKAJ/IAIoAigoAlxBAE4EQCACKAIoKAI4IAIoAigoAlxqDAELQQALIAIoAigoAmwgAigCKCgCXGtBABApIAIoAiggAigCKCgCbDYCXCACKAIoKAIAEB0gAigCKCgCACgCEEUEQCACQQA2AiwMBAsLDAELCyACKAIoQQA2ArQtIAIoAiRBBEYEQCACKAIoAn8gAigCKCgCXEEATgRAIAIoAigoAjggAigCKCgCXGoMAQtBAAsgAigCKCgCbCACKAIoKAJca0EBECkgAigCKCACKAIoKAJsNgJcIAIoAigoAgAQHSACKAIoKAIAKAIQRQRAIAJBAjYCLAwCCyACQQM2AiwMAQsgAigCKCgCoC0EQCACKAIoAn8gAigCKCgCXEEATgRAIAIoAigoAjggAigCKCgCXGoMAQtBAAsgAigCKCgCbCACKAIoKAJca0EAECkgAigCKCACKAIoKAJsNgJcIAIoAigoAgAQHSACKAIoKAIAKAIQRQRAIAJBADYCLAwCCwsgAkEBNgIsCyACKAIsIQAgAkEwaiQAIAALwAUBAn8jAEEgayICJAAgAiAANgIYIAIgATYCFAJAA0ACQCACKAIYKAJ0RQRAIAIoAhgQViACKAIYKAJ0RQRAIAIoAhRFBEAgAkEANgIcDAULDAILCyACKAIYQQA2AmAgAiACKAIYIgAoAjggACgCbGotAAA6AA8gAigCGCIAKAKkLSAAKAKgLUEBdGpBADsBACACLQAPIQEgAigCGCIAKAKYLSEDIAAgACgCoC0iAEEBajYCoC0gACADaiABOgAAIAIoAhggAi0AD0ECdGoiACAALwGUAUEBajsBlAEgAiACKAIYKAKgLSACKAIYKAKcLUEBa0Y2AhAgAigCGCIAIAAoAnRBf2o2AnQgAigCGCIAIAAoAmxBAWo2AmwgAigCEARAIAIoAhgCfyACKAIYKAJcQQBOBEAgAigCGCgCOCACKAIYKAJcagwBC0EACyACKAIYKAJsIAIoAhgoAlxrQQAQKSACKAIYIAIoAhgoAmw2AlwgAigCGCgCABAdIAIoAhgoAgAoAhBFBEAgAkEANgIcDAQLCwwBCwsgAigCGEEANgK0LSACKAIUQQRGBEAgAigCGAJ/IAIoAhgoAlxBAE4EQCACKAIYKAI4IAIoAhgoAlxqDAELQQALIAIoAhgoAmwgAigCGCgCXGtBARApIAIoAhggAigCGCgCbDYCXCACKAIYKAIAEB0gAigCGCgCACgCEEUEQCACQQI2AhwMAgsgAkEDNgIcDAELIAIoAhgoAqAtBEAgAigCGAJ/IAIoAhgoAlxBAE4EQCACKAIYKAI4IAIoAhgoAlxqDAELQQALIAIoAhgoAmwgAigCGCgCXGtBABApIAIoAhggAigCGCgCbDYCXCACKAIYKAIAEB0gAigCGCgCACgCEEUEQCACQQA2AhwMAgsLIAJBATYCHAsgAigCHCEAIAJBIGokACAAC0UAQaCcAUIANwMAQZicAUIANwMAQZCcAUIANwMAQYicAUIANwMAQYCcAUIANwMAQfibAUIANwMAQfCbAUIANwMAQfCbAQu1JQEDfyMAQUBqIgIkACACIAA2AjggAiABNgI0AkACQAJAIAIoAjgQdA0AIAIoAjRBBUoNACACKAI0QQBODQELIAJBfjYCPAwBCyACIAIoAjgoAhw2AiwCQAJAIAIoAjgoAgxFDQAgAigCOCgCBARAIAIoAjgoAgBFDQELIAIoAiwoAgRBmgVHDQEgAigCNEEERg0BCyACKAI4QeDUACgCADYCGCACQX42AjwMAQsgAigCOCgCEEUEQCACKAI4QezUACgCADYCGCACQXs2AjwMAQsgAiACKAIsKAIoNgIwIAIoAiwgAigCNDYCKAJAIAIoAiwoAhQEQCACKAI4EB0gAigCOCgCEEUEQCACKAIsQX82AiggAkEANgI8DAMLDAELAkAgAigCOCgCBA0AIAIoAjRBAXRBCUEAIAIoAjRBBEobayACKAIwQQF0QQlBACACKAIwQQRKG2tKDQAgAigCNEEERg0AIAIoAjhB7NQAKAIANgIYIAJBezYCPAwCCwsCQCACKAIsKAIEQZoFRw0AIAIoAjgoAgRFDQAgAigCOEHs1AAoAgA2AhggAkF7NgI8DAELIAIoAiwoAgRBKkYEQCACIAIoAiwoAjBBBHRBiH9qQQh0NgIoAkACQCACKAIsKAKIAUECSARAIAIoAiwoAoQBQQJODQELIAJBADYCJAwBCwJAIAIoAiwoAoQBQQZIBEAgAkEBNgIkDAELAkAgAigCLCgChAFBBkYEQCACQQI2AiQMAQsgAkEDNgIkCwsLIAIgAigCKCACKAIkQQZ0cjYCKCACKAIsKAJsBEAgAiACKAIoQSByNgIoCyACIAIoAihBHyACKAIoQR9wa2o2AiggAigCLCACKAIoEEwgAigCLCgCbARAIAIoAiwgAigCOCgCMEEQdhBMIAIoAiwgAigCOCgCMEH//wNxEEwLQQBBAEEAED0hACACKAI4IAA2AjAgAigCLEHxADYCBCACKAI4EB0gAigCLCgCFARAIAIoAixBfzYCKCACQQA2AjwMAgsLIAIoAiwoAgRBOUYEQEEAQQBBABAbIQAgAigCOCAANgIwIAIoAiwoAgghASACKAIsIgMoAhQhACADIABBAWo2AhQgACABakEfOgAAIAIoAiwoAgghASACKAIsIgMoAhQhACADIABBAWo2AhQgACABakGLAToAACACKAIsKAIIIQEgAigCLCIDKAIUIQAgAyAAQQFqNgIUIAAgAWpBCDoAAAJAIAIoAiwoAhxFBEAgAigCLCgCCCEBIAIoAiwiAygCFCEAIAMgAEEBajYCFCAAIAFqQQA6AAAgAigCLCgCCCEBIAIoAiwiAygCFCEAIAMgAEEBajYCFCAAIAFqQQA6AAAgAigCLCgCCCEBIAIoAiwiAygCFCEAIAMgAEEBajYCFCAAIAFqQQA6AAAgAigCLCgCCCEBIAIoAiwiAygCFCEAIAMgAEEBajYCFCAAIAFqQQA6AAAgAigCLCgCCCEBIAIoAiwiAygCFCEAIAMgAEEBajYCFCAAIAFqQQA6AAACf0ECIAIoAiwoAoQBQQlGDQAaQQEhAEEEQQAgAigCLCgCiAFBAkgEfyACKAIsKAKEAUECSAVBAQtBAXEbCyEAIAIoAiwoAgghAyACKAIsIgQoAhQhASAEIAFBAWo2AhQgASADaiAAOgAAIAIoAiwoAgghASACKAIsIgMoAhQhACADIABBAWo2AhQgACABakEDOgAAIAIoAixB8QA2AgQgAigCOBAdIAIoAiwoAhQEQCACKAIsQX82AiggAkEANgI8DAQLDAELQQFBACACKAIsKAIcKAIAG0ECQQAgAigCLCgCHCgCLBtqQQRBACACKAIsKAIcKAIQG2pBCEEAIAIoAiwoAhwoAhwbakEQQQAgAigCLCgCHCgCJBtqIQEgAigCLCgCCCEDIAIoAiwiBCgCFCEAIAQgAEEBajYCFCAAIANqIAE6AAAgAigCLCgCHCgCBEH/AXEhASACKAIsKAIIIQMgAigCLCIEKAIUIQAgBCAAQQFqNgIUIAAgA2ogAToAACACKAIsKAIcKAIEQQh2Qf8BcSEBIAIoAiwoAgghAyACKAIsIgQoAhQhACAEIABBAWo2AhQgACADaiABOgAAIAIoAiwoAhwoAgRBEHZB/wFxIQEgAigCLCgCCCEDIAIoAiwiBCgCFCEAIAQgAEEBajYCFCAAIANqIAE6AAAgAigCLCgCHCgCBEEYdiEBIAIoAiwoAgghAyACKAIsIgQoAhQhACAEIABBAWo2AhQgACADaiABOgAAAn9BAiACKAIsKAKEAUEJRg0AGkEBIQBBBEEAIAIoAiwoAogBQQJIBH8gAigCLCgChAFBAkgFQQELQQFxGwshACACKAIsKAIIIQMgAigCLCIEKAIUIQEgBCABQQFqNgIUIAEgA2ogADoAACACKAIsKAIcKAIMQf8BcSEBIAIoAiwoAgghAyACKAIsIgQoAhQhACAEIABBAWo2AhQgACADaiABOgAAIAIoAiwoAhwoAhAEQCACKAIsKAIcKAIUQf8BcSEBIAIoAiwoAgghAyACKAIsIgQoAhQhACAEIABBAWo2AhQgACADaiABOgAAIAIoAiwoAhwoAhRBCHZB/wFxIQEgAigCLCgCCCEDIAIoAiwiBCgCFCEAIAQgAEEBajYCFCAAIANqIAE6AAALIAIoAiwoAhwoAiwEQCACKAI4KAIwIAIoAiwoAgggAigCLCgCFBAbIQAgAigCOCAANgIwCyACKAIsQQA2AiAgAigCLEHFADYCBAsLIAIoAiwoAgRBxQBGBEAgAigCLCgCHCgCEARAIAIgAigCLCgCFDYCICACIAIoAiwoAhwoAhRB//8DcSACKAIsKAIgazYCHANAIAIoAiwoAhQgAigCHGogAigCLCgCDEsEQCACIAIoAiwoAgwgAigCLCgCFGs2AhggAigCLCgCCCACKAIsKAIUaiACKAIsKAIcKAIQIAIoAiwoAiBqIAIoAhgQGhogAigCLCACKAIsKAIMNgIUAkAgAigCLCgCHCgCLEUNACACKAIsKAIUIAIoAiBNDQAgAigCOCgCMCACKAIsKAIIIAIoAiBqIAIoAiwoAhQgAigCIGsQGyEAIAIoAjggADYCMAsgAigCLCIAIAIoAhggACgCIGo2AiAgAigCOBAdIAIoAiwoAhQEQCACKAIsQX82AiggAkEANgI8DAUFIAJBADYCICACIAIoAhwgAigCGGs2AhwMAgsACwsgAigCLCgCCCACKAIsKAIUaiACKAIsKAIcKAIQIAIoAiwoAiBqIAIoAhwQGhogAigCLCIAIAIoAhwgACgCFGo2AhQCQCACKAIsKAIcKAIsRQ0AIAIoAiwoAhQgAigCIE0NACACKAI4KAIwIAIoAiwoAgggAigCIGogAigCLCgCFCACKAIgaxAbIQAgAigCOCAANgIwCyACKAIsQQA2AiALIAIoAixByQA2AgQLIAIoAiwoAgRByQBGBEAgAigCLCgCHCgCHARAIAIgAigCLCgCFDYCFANAIAIoAiwoAhQgAigCLCgCDEYEQAJAIAIoAiwoAhwoAixFDQAgAigCLCgCFCACKAIUTQ0AIAIoAjgoAjAgAigCLCgCCCACKAIUaiACKAIsKAIUIAIoAhRrEBshACACKAI4IAA2AjALIAIoAjgQHSACKAIsKAIUBEAgAigCLEF/NgIoIAJBADYCPAwFCyACQQA2AhQLIAIoAiwoAhwoAhwhASACKAIsIgMoAiAhACADIABBAWo2AiAgAiAAIAFqLQAANgIQIAIoAhAhASACKAIsKAIIIQMgAigCLCIEKAIUIQAgBCAAQQFqNgIUIAAgA2ogAToAACACKAIQDQALAkAgAigCLCgCHCgCLEUNACACKAIsKAIUIAIoAhRNDQAgAigCOCgCMCACKAIsKAIIIAIoAhRqIAIoAiwoAhQgAigCFGsQGyEAIAIoAjggADYCMAsgAigCLEEANgIgCyACKAIsQdsANgIECyACKAIsKAIEQdsARgRAIAIoAiwoAhwoAiQEQCACIAIoAiwoAhQ2AgwDQCACKAIsKAIUIAIoAiwoAgxGBEACQCACKAIsKAIcKAIsRQ0AIAIoAiwoAhQgAigCDE0NACACKAI4KAIwIAIoAiwoAgggAigCDGogAigCLCgCFCACKAIMaxAbIQAgAigCOCAANgIwCyACKAI4EB0gAigCLCgCFARAIAIoAixBfzYCKCACQQA2AjwMBQsgAkEANgIMCyACKAIsKAIcKAIkIQEgAigCLCIDKAIgIQAgAyAAQQFqNgIgIAIgACABai0AADYCCCACKAIIIQEgAigCLCgCCCEDIAIoAiwiBCgCFCEAIAQgAEEBajYCFCAAIANqIAE6AAAgAigCCA0ACwJAIAIoAiwoAhwoAixFDQAgAigCLCgCFCACKAIMTQ0AIAIoAjgoAjAgAigCLCgCCCACKAIMaiACKAIsKAIUIAIoAgxrEBshACACKAI4IAA2AjALCyACKAIsQecANgIECyACKAIsKAIEQecARgRAIAIoAiwoAhwoAiwEQCACKAIsKAIUQQJqIAIoAiwoAgxLBEAgAigCOBAdIAIoAiwoAhQEQCACKAIsQX82AiggAkEANgI8DAQLCyACKAI4KAIwQf8BcSEBIAIoAiwoAgghAyACKAIsIgQoAhQhACAEIABBAWo2AhQgACADaiABOgAAIAIoAjgoAjBBCHZB/wFxIQEgAigCLCgCCCEDIAIoAiwiBCgCFCEAIAQgAEEBajYCFCAAIANqIAE6AABBAEEAQQAQGyEAIAIoAjggADYCMAsgAigCLEHxADYCBCACKAI4EB0gAigCLCgCFARAIAIoAixBfzYCKCACQQA2AjwMAgsLAkACQCACKAI4KAIEDQAgAigCLCgCdA0AIAIoAjRFDQEgAigCLCgCBEGaBUYNAQsgAgJ/IAIoAiwoAoQBRQRAIAIoAiwgAigCNBCyAQwBCwJ/IAIoAiwoAogBQQJGBEAgAigCLCACKAI0ENoCDAELAn8gAigCLCgCiAFBA0YEQCACKAIsIAIoAjQQ2QIMAQsgAigCLCACKAI0IAIoAiwoAoQBQQxsQbDqAGooAggRAgALCws2AgQCQCACKAIEQQJHBEAgAigCBEEDRw0BCyACKAIsQZoFNgIECwJAIAIoAgQEQCACKAIEQQJHDQELIAIoAjgoAhBFBEAgAigCLEF/NgIoCyACQQA2AjwMAgsgAigCBEEBRgRAAkAgAigCNEEBRgRAIAIoAiwQ6QIMAQsgAigCNEEFRwRAIAIoAixBAEEAQQAQVyACKAI0QQNGBEAgAigCLCgCRCACKAIsKAJMQQFrQQF0akEAOwEAIAIoAiwoAkRBACACKAIsKAJMQQFrQQF0EDMgAigCLCgCdEUEQCACKAIsQQA2AmwgAigCLEEANgJcIAIoAixBADYCtC0LCwsLIAIoAjgQHSACKAI4KAIQRQRAIAIoAixBfzYCKCACQQA2AjwMAwsLCyACKAI0QQRHBEAgAkEANgI8DAELIAIoAiwoAhhBAEwEQCACQQE2AjwMAQsCQCACKAIsKAIYQQJGBEAgAigCOCgCMEH/AXEhASACKAIsKAIIIQMgAigCLCIEKAIUIQAgBCAAQQFqNgIUIAAgA2ogAToAACACKAI4KAIwQQh2Qf8BcSEBIAIoAiwoAgghAyACKAIsIgQoAhQhACAEIABBAWo2AhQgACADaiABOgAAIAIoAjgoAjBBEHZB/wFxIQEgAigCLCgCCCEDIAIoAiwiBCgCFCEAIAQgAEEBajYCFCAAIANqIAE6AAAgAigCOCgCMEEYdiEBIAIoAiwoAgghAyACKAIsIgQoAhQhACAEIABBAWo2AhQgACADaiABOgAAIAIoAjgoAghB/wFxIQEgAigCLCgCCCEDIAIoAiwiBCgCFCEAIAQgAEEBajYCFCAAIANqIAE6AAAgAigCOCgCCEEIdkH/AXEhASACKAIsKAIIIQMgAigCLCIEKAIUIQAgBCAAQQFqNgIUIAAgA2ogAToAACACKAI4KAIIQRB2Qf8BcSEBIAIoAiwoAgghAyACKAIsIgQoAhQhACAEIABBAWo2AhQgACADaiABOgAAIAIoAjgoAghBGHYhASACKAIsKAIIIQMgAigCLCIEKAIUIQAgBCAAQQFqNgIUIAAgA2ogAToAAAwBCyACKAIsIAIoAjgoAjBBEHYQTCACKAIsIAIoAjgoAjBB//8DcRBMCyACKAI4EB0gAigCLCgCGEEASgRAIAIoAixBACACKAIsKAIYazYCGAsgAkEAQQEgAigCLCgCFBs2AjwLIAIoAjwhACACQUBrJAAgAAuOAgEBfyMAQSBrIgEgADYCHCABIAEoAhwoAiw2AgwgASABKAIcKAJMNgIYIAEgASgCHCgCRCABKAIYQQF0ajYCEANAIAEgASgCEEF+aiIANgIQIAEgAC8BADYCFCABKAIQAn8gASgCFCABKAIMTwRAIAEoAhQgASgCDGsMAQtBAAs7AQAgASABKAIYQX9qIgA2AhggAA0ACyABIAEoAgw2AhggASABKAIcKAJAIAEoAhhBAXRqNgIQA0AgASABKAIQQX5qIgA2AhAgASAALwEANgIUIAEoAhACfyABKAIUIAEoAgxPBEAgASgCFCABKAIMawwBC0EACzsBACABIAEoAhhBf2oiADYCGCAADQALC6gCAQF/IwBBEGsiASQAIAEgADYCDCABKAIMIAEoAgwoAixBAXQ2AjwgASgCDCgCRCABKAIMKAJMQQFrQQF0akEAOwEAIAEoAgwoAkRBACABKAIMKAJMQQFrQQF0EDMgASgCDCABKAIMKAKEAUEMbEGw6gBqLwECNgKAASABKAIMIAEoAgwoAoQBQQxsQbDqAGovAQA2AowBIAEoAgwgASgCDCgChAFBDGxBsOoAai8BBDYCkAEgASgCDCABKAIMKAKEAUEMbEGw6gBqLwEGNgJ8IAEoAgxBADYCbCABKAIMQQA2AlwgASgCDEEANgJ0IAEoAgxBADYCtC0gASgCDEECNgJ4IAEoAgxBAjYCYCABKAIMQQA2AmggASgCDEEANgJIIAFBEGokAAubAgEBfyMAQRBrIgEkACABIAA2AggCQCABKAIIEHQEQCABQX42AgwMAQsgASgCCEEANgIUIAEoAghBADYCCCABKAIIQQA2AhggASgCCEECNgIsIAEgASgCCCgCHDYCBCABKAIEQQA2AhQgASgCBCABKAIEKAIINgIQIAEoAgQoAhhBAEgEQCABKAIEQQAgASgCBCgCGGs2AhgLIAEoAgQCf0E5IAEoAgQoAhhBAkYNABpBKkHxACABKAIEKAIYGws2AgQCfyABKAIEKAIYQQJGBEBBAEEAQQAQGwwBC0EAQQBBABA9CyEAIAEoAgggADYCMCABKAIEQQA2AiggASgCBBDrAiABQQA2AgwLIAEoAgwhACABQRBqJAAgAAtFAQF/IwBBEGsiASQAIAEgADYCDCABIAEoAgwQ3wI2AgggASgCCEUEQCABKAIMKAIcEN4CCyABKAIIIQAgAUEQaiQAIAAL4AgBAX8jAEEwayICJAAgAiAANgIoIAIgATYCJCACQQg2AiAgAkFxNgIcIAJBCTYCGCACQQA2AhQgAkGQgwE2AhAgAkE4NgIMIAJBATYCBAJAAkACQCACKAIQRQ0AIAIoAhAsAABBqOoALAAARw0AIAIoAgxBOEYNAQsgAkF6NgIsDAELIAIoAihFBEAgAkF+NgIsDAELIAIoAihBADYCGCACKAIoKAIgRQRAIAIoAihBBTYCICACKAIoQQA2AigLIAIoAigoAiRFBEAgAigCKEEGNgIkCyACKAIkQX9GBEAgAkEGNgIkCwJAIAIoAhxBAEgEQCACQQA2AgQgAkEAIAIoAhxrNgIcDAELIAIoAhxBD0oEQCACQQI2AgQgAiACKAIcQRBrNgIcCwsCQAJAIAIoAhhBAUgNACACKAIYQQlKDQAgAigCIEEIRw0AIAIoAhxBCEgNACACKAIcQQ9KDQAgAigCJEEASA0AIAIoAiRBCUoNACACKAIUQQBIDQAgAigCFEEESg0AIAIoAhxBCEcNASACKAIEQQFGDQELIAJBfjYCLAwBCyACKAIcQQhGBEAgAkEJNgIcCyACIAIoAigoAihBAUHELSACKAIoKAIgEQEANgIIIAIoAghFBEAgAkF8NgIsDAELIAIoAiggAigCCDYCHCACKAIIIAIoAig2AgAgAigCCEEqNgIEIAIoAgggAigCBDYCGCACKAIIQQA2AhwgAigCCCACKAIcNgIwIAIoAghBASACKAIIKAIwdDYCLCACKAIIIAIoAggoAixBAWs2AjQgAigCCCACKAIYQQdqNgJQIAIoAghBASACKAIIKAJQdDYCTCACKAIIIAIoAggoAkxBAWs2AlQgAigCCCACKAIIKAJQQQJqQQNuNgJYIAIoAigoAiggAigCCCgCLEECIAIoAigoAiARAQAhACACKAIIIAA2AjggAigCKCgCKCACKAIIKAIsQQIgAigCKCgCIBEBACEAIAIoAgggADYCQCACKAIoKAIoIAIoAggoAkxBAiACKAIoKAIgEQEAIQAgAigCCCAANgJEIAIoAghBADYCwC0gAigCCEEBIAIoAhhBBmp0NgKcLSACIAIoAigoAiggAigCCCgCnC1BBCACKAIoKAIgEQEANgIAIAIoAgggAigCADYCCCACKAIIIAIoAggoApwtQQJ0NgIMAkACQCACKAIIKAI4RQ0AIAIoAggoAkBFDQAgAigCCCgCREUNACACKAIIKAIIDQELIAIoAghBmgU2AgQgAigCKEHo1AAoAgA2AhggAigCKBCzARogAkF8NgIsDAELIAIoAgggAigCACACKAIIKAKcLUEBdkEBdGo2AqQtIAIoAgggAigCCCgCCCACKAIIKAKcLUEDbGo2ApgtIAIoAgggAigCJDYChAEgAigCCCACKAIUNgKIASACKAIIIAIoAiA6ACQgAiACKAIoEOACNgIsCyACKAIsIQAgAkEwaiQAIAALGAEBfyMAQRBrIgEgADYCDCABKAIMQQxqC2wBAX8jAEEQayICIAA2AgwgAiABNgIIIAJBADYCBANAIAIgAigCBCACKAIMQQFxcjYCBCACIAIoAgxBAXY2AgwgAiACKAIEQQF0NgIEIAIgAigCCEF/aiIANgIIIABBAEoNAAsgAigCBEEBdguVAgEBfyMAQUBqIgMkACADIAA2AjwgAyABNgI4IAMgAjYCNCADQQA2AgwgA0EBNgIIA0AgAygCCEEPSkUEQCADIAMoAgwgAygCNCADKAIIQQFrQQF0ai8BAGpBAXQ2AgwgA0EQaiADKAIIQQF0aiADKAIMOwEAIAMgAygCCEEBajYCCAwBCwsgA0EANgIEA0AgAygCBCADKAI4TARAIAMgAygCPCADKAIEQQJ0ai8BAjYCACADKAIABEAgA0EQaiADKAIAQQF0aiIBLwEAIQAg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ACAALwG4LUHA4wAvAQAgASgCHCgCvC10cjsBuC0gASgCHCIAIAEoAhAgACgCvC1qNgK8LQsgASgCHBC3ASABQSBqJAALIwEBfyMAQRBrIgEkACABIAA2AgwgASgCDBC3ASABQRBqJAALlgEBAX8jAEEQayIBJAAgASAANgIMIAEoAgwgASgCDEGUAWo2ApgWIAEoAgxBgNsANgKgFiABKAIMIAEoAgxBiBNqNgKkFiABKAIMQZTbADYCrBYgASgCDCABKAIMQfwUajYCsBYgASgCDEGo2wA2ArgWIAEoAgxBADsBuC0gASgCDEEANgK8LSABKAIMELkBIAFBEGokAAvXDQEBfyMAQSBrIgMgADYCGCADIAE2AhQgAyACNgIQIAMgAygCGEEQdjYCDCADIAMoAhhB//8DcTYCGAJAIAMoAhBBAUYEQCADIAMoAhQtAAAgAygCGGo2AhggAygCGEHx/wNPBEAgAyADKAIYQfH/A2s2AhgLIAMgAygCGCADKAIMajYCDCADKAIMQfH/A08EQCADIAMoAgxB8f8DazYCDAsgAyADKAIYIAMoAgxBEHRyNgIcDAELIAMoAhRFBEAgA0EBNgIcDAELIAMoAhBBEEkEQANAIAMgAygCECIAQX9qNgIQIAAEQCADIAMoAhQiAEEBajYCFCADIAAtAAAgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMDAELCyADKAIYQfH/A08EQCADIAMoAhhB8f8DazYCGAsgAyADKAIMQfH/A3A2AgwgAyADKAIYIAMoAgxBEHRyNgIcDAELA0AgAygCEEGwK0lFBEAgAyADKAIQQbArazYCECADQdsCNgIIA0AgAyADKAIULQAAIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAEgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0AAiADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQADIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAQgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ABSADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAGIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAcgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ACCADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAJIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAogAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ACyADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAMIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAA0gAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ADiADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAPIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhRBEGo2AhQgAyADKAIIQX9qIgA2AgggAA0ACyADIAMoAhhB8f8DcDYCGCADIAMoAgxB8f8DcDYCDAwBCwsgAygCEARAA0AgAygCEEEQSUUEQCADIAMoAhBBEGs2AhAgAyADKAIULQAAIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAEgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0AAiADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQADIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAQgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ABSADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAGIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAcgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ACCADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAJIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAogAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ACyADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAMIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAA0gAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ADiADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAPIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhRBEGo2AhQMAQsLA0AgAyADKAIQIgBBf2o2AhAgAARAIAMgAygCFCIAQQFqNgIUIAMgAC0AACADKAIYajYCGCADIAMoAhggAygCDGo2AgwMAQsLIAMgAygCGEHx/wNwNgIYIAMgAygCDEHx/wNwNgIMCyADIAMoAhggAygCDEEQdHI2AhwLIAMoAhwLKQEBfyMAQRBrIgIkACACIAA2AgwgAiABNgIIIAIoAggQFiACQRBqJAALOgEBfyMAQRBrIgMkACADIAA2AgwgAyABNgIIIAMgAjYCBCADKAIIIAMoAgRsEBkhACADQRBqJAAgAAuEAgIBfwF+IwBB4ABrIgIkACACIAA2AlggAiABNgJUIAIgAigCWCACQcgAakIMEC8iAzcDCAJAIANCAFMEQCACKAJUIAIoAlgQGCACQX82AlwMAQsgAikDCEIMUgRAIAIoAlRBEUEAEBUgAkF/NgJcDAELIAIoAlQgAkHIAGoiACAAQgxBABB4IAIoAlggAkEQahA5QQBIBEAgAkEANgJcDAELIAIoAjggAkEGaiACQQRqEMQBAkAgAi0AUyACKAI8QRh2Rg0AIAItAFMgAi8BBkEIdUYNACACKAJUQRtBABAVIAJBfzYCXAwBCyACQQA2AlwLIAIoAlwhACACQeAAaiQAIAALygMBAX8jAEHQAGsiBSQAIAUgADYCRCAFIAE2AkAgBSACNgI8IAUgAzcDMCAFIAQ2AiwgBSAFKAJANgIoAkACQAJAAkACQAJAAkACQAJAIAUoAiwODwABAgMFBgcHBwcHBwcHBAcLIAUoAkQgBSgCKBDvAkEASARAIAVCfzcDSAwICyAFQgA3A0gMBwsgBSAFKAJEIAUoAjwgBSkDMBAvIgM3AyAgA0IAUwRAIAUoAiggBSgCRBAYIAVCfzcDSAwHCyAFKAJAIAUoAjwgBSgCPCAFKQMgQQAQeCAFIAUpAyA3A0gMBgsgBUIANwNIDAULIAUgBSgCPDYCHCAFKAIcQQA7ATIgBSgCHCIAIAApAwBCgAGENwMAIAUoAhwpAwBCCINCAFIEQCAFKAIcIgAgACkDIEIMfTcDIAsgBUIANwNIDAQLIAVBfzYCFCAFQQU2AhAgBUEENgIMIAVBAzYCCCAFQQI2AgQgBUEBNgIAIAVBACAFEDc3A0gMAwsgBSAFKAIoIAUoAjwgBSkDMBBDNwNIDAILIAUoAigQugEgBUIANwNIDAELIAUoAihBEkEAEBUgBUJ/NwNICyAFKQNIIQMgBUHQAGokACADC+4CAQF/IwBBIGsiBSQAIAUgADYCGCAFIAE2AhQgBSACOwESIAUgAzYCDCAFIAQ2AggCQAJAAkAgBSgCCEUNACAFKAIURQ0AIAUvARJBAUYNAQsgBSgCGEEIakESQQAQFSAFQQA2AhwMAQsgBSgCDEEBcQRAIAUoAhhBCGpBGEEAEBUgBUEANgIcDAELIAVBGBAZIgA2AgQgAEUEQCAFKAIYQQhqQQ5BABAVIAVBADYCHAwBCyMAQRBrIgAgBSgCBDYCDCAAKAIMQQA2AgAgACgCDEEANgIEIAAoAgxBADYCCCAFKAIEQfis0ZEBNgIMIAUoAgRBic+VmgI2AhAgBSgCBEGQ8dmiAzYCFCAFKAIEQQAgBSgCCCAFKAIIECytQQEQeCAFIAUoAhggBSgCFEEDIAUoAgQQZCIANgIAIABFBEAgBSgCBBC6ASAFQQA2AhwMAQsgBSAFKAIANgIcCyAFKAIcIQAgBUEgaiQAIAAL6AYBAX8jAEHgAGsiBCQAIAQgADYCVCAEIAE2AlAgBCACNwNIIAQgAzYCRAJAIAQoAlQpAzggBCkDSHxCgIAEfEIBfSAEKQNIVARAIAQoAkRBEkEAEBUgBEJ/NwNYDAELIAQgBCgCVCgCBCAEKAJUKQMIp0EDdGopAwA3AyAgBCgCVCkDOCAEKQNIfCAEKQMgVgRAIAQgBCgCVCkDCCAEKQNIIAQpAyAgBCgCVCkDOH19QoCABHxCAX1CEIh8NwMYIAQpAxggBCgCVCkDEFYEQCAEIAQoAlQpAxA3AxAgBCkDEFAEQCAEQhA3AxALA0AgBCkDECAEKQMYWkUEQCAEIAQpAxBCAYY3AxAMAQsLIAQoAlQgBCkDECAEKAJEEL0BQQFxRQRAIAQoAkRBDkEAEBUgBEJ/NwNYDAMLCwNAIAQoAlQpAwggBCkDGFQEQEGAgAQQGSEAIAQoAlQoAgAgBCgCVCkDCKdBBHRqIAA2AgAgAARAIAQoAlQoAgAgBCgCVCkDCKdBBHRqQoCABDcDCCAEKAJUIgAgACkDCEIBfDcDCCAEIAQpAyBCgIAEfDcDICAEKAJUKAIEIAQoAlQpAwinQQN0aiAEKQMgNwMADAIFIAQoAkRBDkEAEBUgBEJ/NwNYDAQLAAsLCyAEIAQoAlQpA0A3AzAgBCAEKAJUKQM4IAQoAlQoAgQgBCkDMKdBA3RqKQMAfTcDKCAEQgA3AzgDQCAEKQM4IAQpA0hUBEAgBAJ+IAQpA0ggBCkDOH0gBCgCVCgCACAEKQMwp0EEdGopAwggBCkDKH1UBEAgBCkDSCAEKQM4fQwBCyAEKAJUKAIAIAQpAzCnQQR0aikDCCAEKQMofQs3AwggBCgCVCgCACAEKQMwp0EEdGooAgAgBCkDKKdqIAQoAlAgBCkDOKdqIAQpAwinEBoaIAQpAwggBCgCVCgCACAEKQMwp0EEdGopAwggBCkDKH1RBEAgBCAEKQMwQgF8NwMwCyAEIAQpAwggBCkDOHw3AzggBEIANwMoDAELCyAEKAJUIgAgBCkDOCAAKQM4fDcDOCAEKAJUIAQpAzA3A0AgBCgCVCkDOCAEKAJUKQMwVgRAIAQoAlQgBCgCVCkDODcDMAsgBCAEKQM4NwNYCyAEKQNYIQIgBEHgAGokACACC+cDAQF/IwBBQGoiAyQAIAMgADYCNCADIAE2AjAgAyACNwMoIAMCfiADKQMoIAMoAjQpAzAgAygCNCkDOH1UBEAgAykDKAwBCyADKAI0KQMwIAMoAjQpAzh9CzcDKAJAIAMpAyhQBEAgA0IANwM4DAELIAMpAyhC////////////AFYEQCADQn83AzgMAQsgAyADKAI0KQNANwMYIAMgAygCNCkDOCADKAI0KAIEIAMpAxinQQN0aikDAH03AxAgA0IANwMgA0AgAykDICADKQMoVARAIAMCfiADKQMoIAMpAyB9IAMoAjQoAgAgAykDGKdBBHRqKQMIIAMpAxB9VARAIAMpAyggAykDIH0MAQsgAygCNCgCACADKQMYp0EEdGopAwggAykDEH0LNwMIIAMoAjAgAykDIKdqIAMoAjQoAgAgAykDGKdBBHRqKAIAIAMpAxCnaiADKQMIpxAaGiADKQMIIAMoAjQoAgAgAykDGKdBBHRqKQMIIAMpAxB9UQRAIAMgAykDGEIBfDcDGAsgAyADKQMIIAMpAyB8NwMgIANCADcDEAwBCwsgAygCNCIAIAMpAyAgACkDOHw3AzggAygCNCADKQMYNwNAIAMgAykDIDcDOAsgAykDOCECIANBQGskACACC64EAQF/IwBBQGoiAyQAIAMgADYCOCADIAE3AzAgAyACNgIsAkAgAykDMFAEQCADQQBCAEEBIAMoAiwQTTYCPAwBCyADKQMwIAMoAjgpAzBWBEAgAygCLEESQQAQFSADQQA2AjwMAQsgAygCOCgCKARAIAMoAixBHUEAEBUgA0EANgI8DAELIAMgAygCOCADKQMwELsBNwMgIAMgAykDMCADKAI4KAIEIAMpAyCnQQN0aikDAH03AxggAykDGFAEQCADIAMpAyBCf3w3AyAgAyADKAI4KAIAIAMpAyCnQQR0aikDCDcDGAsgAyADKAI4KAIAIAMpAyCnQQR0aikDCCADKQMYfTcDECADKQMQIAMpAzBWBEAgAygCLEEcQQAQFSADQQA2AjwMAQsgAyADKAI4KAIAIAMpAyBCAXxBACADKAIsEE0iADYCDCAARQRAIANBADYCPAwBCyADKAIMKAIAIAMoAgwpAwhCAX2nQQR0aiADKQMYNwMIIAMoAgwoAgQgAygCDCkDCKdBA3RqIAMpAzA3AwAgAygCDCADKQMwNwMwIAMoAgwCfiADKAI4KQMYIAMoAgwpAwhCAX1UBEAgAygCOCkDGAwBCyADKAIMKQMIQgF9CzcDGCADKAI4IAMoAgw2AiggAygCDCADKAI4NgIoIAMoAjggAygCDCkDCDcDICADKAIMIAMpAyBCAXw3AyAgAyADKAIMNgI8CyADKAI8IQAgA0FAayQAIAALyAkBAX8jAEHwAGsiBCQAIAQgADYCZCAEIAE2AmAgBCACNwNYIAQgAzYCVCAEIAQoAmQ2AlACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAQoAlQOFAYHAgwEBQoPAAMJEQsQDggSARINEgtBAEIAQQAgBCgCUBBNIQAgBCgCUCAANgIUIABFBEAgBEJ/NwNoDBMLIAQoAlAoAhRCADcDOCAEKAJQKAIUQgA3A0AgBEIANwNoDBILIAQoAlAoAhAgBCkDWCAEKAJQEPQCIQAgBCgCUCAANgIUIABFBEAgBEJ/NwNoDBILIAQoAlAoAhQgBCkDWDcDOCAEKAJQKAIUIAQoAlAoAhQpAwg3A0AgBEIANwNoDBELIARCADcDaAwQCyAEKAJQKAIQEDQgBCgCUCAEKAJQKAIUNgIQIAQoAlBBADYCFCAEQgA3A2gMDwsgBCAEKAJQIAQoAmAgBCkDWBBDNwNoDA4LIAQoAlAoAhAQNCAEKAJQKAIUEDQgBCgCUBAWIARCADcDaAwNCyAEKAJQKAIQQgA3AzggBCgCUCgCEEIANwNAIARCADcDaAwMCyAEKQNYQv///////////wBWBEAgBCgCUEESQQAQFSAEQn83A2gMDAsgBCAEKAJQKAIQIAQoAmAgBCkDWBDzAjcDaAwLCyAEQQBCAEEAIAQoAlAQTTYCTCAEKAJMRQRAIARCfzcDaAwLCyAEKAJQKAIQEDQgBCgCUCAEKAJMNgIQIARCADcDaAwKCyAEKAJQKAIUEDQgBCgCUEEANgIUIARCADcDaAwJCyAEIAQoAlAoAhAgBCgCYCAEKQNYIAQoAlAQvAGsNwNoDAgLIAQgBCgCUCgCFCAEKAJgIAQpA1ggBCgCUBC8Aaw3A2gMBwsgBCkDWEI4VARAIAQoAlBBEkEAEBUgBEJ/NwNoDAcLIAQgBCgCYDYCSCAEKAJIEDwgBCgCSCAEKAJQKAIMNgIoIAQoAkggBCgCUCgCECkDMDcDGCAEKAJIIAQoAkgpAxg3AyAgBCgCSEEAOwEwIAQoAkhBADsBMiAEKAJIQtwBNwMAIARCODcDaAwGCyAEKAJQIAQoAmAoAgA2AgwgBEIANwNoDAULIARBfzYCQCAEQRM2AjwgBEELNgI4IARBDTYCNCAEQQw2AjAgBEEKNgIsIARBDzYCKCAEQQk2AiQgBEERNgIgIARBCDYCHCAEQQc2AhggBEEGNgIUIARBBTYCECAEQQQ2AgwgBEEDNgIIIARBAjYCBCAEQQE2AgAgBEEAIAQQNzcDaAwECyAEKAJQKAIQKQM4Qv///////////wBWBEAgBCgCUEEeQT0QFSAEQn83A2gMBAsgBCAEKAJQKAIQKQM4NwNoDAMLIAQoAlAoAhQpAzhC////////////AFYEQCAEKAJQQR5BPRAVIARCfzcDaAwDCyAEIAQoAlAoAhQpAzg3A2gMAgsgBCkDWEL///////////8AVgRAIAQoAlBBEkEAEBUgBEJ/NwNoDAILIAQgBCgCUCgCFCAEKAJgIAQpA1ggBCgCUBDyAjcDaAwBCyAEKAJQQRxBABAVIARCfzcDaAsgBCkDaCECIARB8ABqJAAgAgt5AQF/IwBBEGsiASQAIAEgADYCCAJAIAEoAggoAiRBAUYEQCABKAIIQQxqQRJBABAVIAFBfzYCDAwBCyABKAIIQQBCAEEIECJCAFMEQCABQX82AgwMAQsgASgCCEEBNgIkIAFBADYCDAsgASgCDCEAIAFBEGokACAAC4MBAQF/IwBBEGsiAiQAIAIgADYCCCACIAE3AwACQCACKAIIKAIkQQFGBEAgAigCCEEMakESQQAQFSACQX82AgwMAQsgAigCCEEAIAIpAwBBERAiQgBTBEAgAkF/NgIMDAELIAIoAghBATYCJCACQQA2AgwLIAIoAgwhACACQRBqJAAgAAtbAQF/IwBBIGsiAyQAIAMgADYCHCADIAE5AxAgAyACOQMIIAMoAhwEQCADKAIcIAMrAxA5AyAgAygCHCADKwMIOQMoIAMoAhxEAAAAAAAAAAAQWAsgA0EgaiQAC1gBAX8jAEEQayIBJAAgASAANgIMIAEoAgwEQCABKAIMRAAAAAAAAAAAOQMYIAEoAgwoAgBEAAAAAAAAAAAgASgCDCgCDCABKAIMKAIEERsACyABQRBqJAALvQcBCX8gACgCBCIHQQNxIQIgACAHQXhxIgZqIQQCQEHInAEoAgAiBSAASw0AIAJBAUYNAAsCQCACRQRAQQAhAiABQYACSQ0BIAYgAUEEak8EQCAAIQIgBiABa0GYoAEoAgBBAXRNDQILQQAPCwJAIAYgAU8EQCAGIAFrIgJBEEkNASAAIAdBAXEgAXJBAnI2AgQgACABaiIBIAJBA3I2AgQgBCAEKAIEQQFyNgIEIAEgAhDAAQwBC0EAIQIgBEHQnAEoAgBGBEBBxJwBKAIAIAZqIgUgAU0NAiAAIAdBAXEgAXJBAnI2AgQgACABaiICIAUgAWsiAUEBcjYCBEHEnAEgATYCAEHQnAEgAjYCAAwBCyAEQcycASgCAEYEQEHAnAEoAgAgBmoiBSABSQ0CAkAgBSABayICQRBPBEAgACAHQQFxIAFyQQJyNgIEIAAgAWoiASACQQFyNgIEIAAgBWoiBSACNgIAIAUgBSgCBEF+cTYCBAwBCyAAIAdBAXEgBXJBAnI2AgQgACAFaiIBIAEoAgRBAXI2AgRBACECQQAhAQtBzJwBIAE2AgBBwJwBIAI2AgAMAQsgBCgCBCIDQQJxDQEgA0F4cSAGaiIJIAFJDQEgCSABayEKAkAgA0H/AU0EQCAEKAIIIgYgA0EDdiIFQQN0QeCcAWpHGiAGIAQoAgwiCEYEQEG4nAFBuJwBKAIAQX4gBXdxNgIADAILIAYgCDYCDCAIIAY2AggMAQsgBCgCGCEIAkAgBCAEKAIMIgNHBEAgBSAEKAIIIgJNBEAgAigCDBoLIAIgAzYCDCADIAI2AggMAQsCQCAEQRRqIgIoAgAiBg0AIARBEGoiAigCACIGDQBBACEDDAELA0AgAiEFIAYiA0EUaiICKAIAIgYNACADQRBqIQIgAygCECIGDQALIAVBADYCAAsgCEUNAAJAIAQgBCgCHCIFQQJ0QeieAWoiAigCAEYEQCACIAM2AgAgAw0BQbycAUG8nAEoAgBBfiAFd3E2AgAMAgsgCEEQQRQgCCgCECAERhtqIAM2AgAgA0UNAQsgAyAINgIYIAQoAhAiAgRAIAMgAjYCECACIAM2AhgLIAQoAhQiAkUNACADIAI2AhQgAiADNgIYCyAKQQ9NBEAgACAHQQFxIAlyQQJyNgIEIAAgCWoiASABKAIEQQFyNgIEDAELIAAgB0EBcSABckECcjYCBCAAIAFqIgIgCkEDcjYCBCAAIAlqIgEgASgCBEEBcjYCBCACIAoQwAELIAAhAgsgAgtIAQF/IwBBEGsiASQAIAEgADYCDCABKAIMBEAgASgCDCgCCARAIAEoAgwoAgwgASgCDCgCCBEDAAsgASgCDBAWCyABQRBqJAALKwEBfyMAQRBrIgEkACABIAA2AgwgASgCDEQAAAAAAADwPxBYIAFBEGokAAucAgIBfwF8IwBBIGsiASAANwMQIAEgASkDELpEAAAAAAAA6D+jOQMIAkAgASsDCEQAAOD////vQWQEQCABQX82AgQMAQsgAQJ/IAErAwgiAkQAAAAAAADwQWMgAkQAAAAAAAAAAGZxBEAgAqsMAQtBAAs2AgQLAkAgASgCBEGAgICAeEsEQCABQYCAgIB4NgIcDAELIAEgASgCBEF/ajYCBCABIAEoAgQgASgCBEEBdnI2AgQgASABKAIEIAEoAgRBAnZyNgIEIAEgASgCBCABKAIEQQR2cjYCBCABIAEoAgQgASgCBEEIdnI2AgQgASABKAIEIAEoAgRBEHZyNgIEIAEgASgCBEEBajYCBCABIAEoAgQ2AhwLIAEoAhwLkwEBAX8jAEEgayIDJAAgAyAANgIYIAMgATcDECADIAI2AgwCQCADKQMQUARAIANBAToAHwwBCyADIAMpAxAQ/QI2AgggAygCCCADKAIYKAIATQRAIANBAToAHwwBCyADKAIYIAMoAgggAygCDBBaQQFxRQRAIANBADoAHwwBCyADQQE6AB8LIAMtAB8aIANBIGokAAuzAgIBfwF+IwBBMGsiBCQAIAQgADYCJCAEIAE2AiAgBCACNgIcIAQgAzYCGAJAAkAgBCgCJARAIAQoAiANAQsgBCgCGEESQQAQFSAEQn83AygMAQsgBCgCJCkDCEIAVgRAIAQgBCgCIBB7NgIUIAQgBCgCFCAEKAIkKAIAcDYCECAEIAQoAiQoAhAgBCgCEEECdGooAgA2AgwDQAJAIAQoAgxFDQAgBCgCICAEKAIMKAIAEFsEQCAEIAQoAgwoAhg2AgwMAgUgBCgCHEEIcQRAIAQoAgwpAwhCf1IEQCAEIAQoAgwpAwg3AygMBgsMAgsgBCgCDCkDEEJ/UgRAIAQgBCgCDCkDEDcDKAwFCwsLCwsgBCgCGEEJQQAQFSAEQn83AygLIAQpAyghBSAEQTBqJAAgBQtGAQF/IwBBEGsiASQAIAEgADYCDANAIAEoAgwEQCABIAEoAgwoAhg2AgggASgCDBAWIAEgASgCCDYCDAwBCwsgAUEQaiQAC5cBAQF/IwBBEGsiASQAIAEgADYCDCABKAIMBEAgASgCDCgCEARAIAFBADYCCANAIAEoAgggASgCDCgCAEkEQCABKAIMKAIQIAEoAghBAnRqKAIABEAgASgCDCgCECABKAIIQQJ0aigCABCAAwsgASABKAIIQQFqNgIIDAELCyABKAIMKAIQEBYLIAEoAgwQFgsgAUEQaiQAC3QBAX8jAEEQayIBJAAgASAANgIIIAFBGBAZIgA2AgQCQCAARQRAIAEoAghBDkEAEBUgAUEANgIMDAELIAEoAgRBADYCACABKAIEQgA3AwggASgCBEEANgIQIAEgASgCBDYCDAsgASgCDCEAIAFBEGokACAAC58BAQF/IwBBEGsiAiAANgIMIAIgATYCCCACQQA2AgQDQCACKAIEIAIoAgwoAkRJBEAgAigCDCgCTCACKAIEQQJ0aigCACACKAIIRgRAIAIoAgwoAkwgAigCBEECdGogAigCDCgCTCACKAIMKAJEQQFrQQJ0aigCADYCACACKAIMIgAgACgCREF/ajYCRAUgAiACKAIEQQFqNgIEDAILCwsLVAEBfyMAQRBrIgEkACABIAA2AgwgASgCDEEBOgAoAn8jAEEQayIAIAEoAgxBDGo2AgwgACgCDCgCAEULBEAgASgCDEEMakEIQQAQFQsgAUEQaiQAC+EBAQN/IwBBIGsiAiQAIAIgADYCGCACIAE2AhQCQCACKAIYKAJEQQFqIAIoAhgoAkhPBEAgAiACKAIYKAJIQQpqNgIMIAIgAigCGCgCTCACKAIMQQJ0EE82AhAgAigCEEUEQCACKAIYQQhqQQ5BABAVIAJBfzYCHAwCCyACKAIYIAIoAgw2AkggAigCGCACKAIQNgJMCyACKAIUIQEgAigCGCgCTCEDIAIoAhgiBCgCRCEAIAQgAEEBajYCRCAAQQJ0IANqIAE2AgAgAkEANgIcCyACKAIcIQAgAkEgaiQAIAALQAEBfyMAQRBrIgIkACACIAA2AgwgAiABNgIIIAIoAgwgAigCCDYCLCACKAIIIAIoAgwQhQMhACACQRBqJAAgAAu3CQEBfyMAQeDAAGsiBSQAIAUgADYC1EAgBSABNgLQQCAFIAI2AsxAIAUgAzcDwEAgBSAENgK8QCAFIAUoAtBANgK4QAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAFKAK8QA4RAwQABgECBQkKCgoKCgoICgcKCyAFQgA3A9hADAoLIAUgBSgCuEBB5ABqIAUoAsxAIAUpA8BAEEM3A9hADAkLIAUoArhAEBYgBUIANwPYQAwICyAFKAK4QCgCEARAIAUgBSgCuEAoAhAgBSgCuEApAxggBSgCuEBB5ABqEH8iAzcDmEAgA1AEQCAFQn83A9hADAkLIAUoArhAKQMIIAUpA5hAfCAFKAK4QCkDCFQEQCAFKAK4QEHkAGpBFUEAEBUgBUJ/NwPYQAwJCyAFKAK4QCIAIAUpA5hAIAApAwB8NwMAIAUoArhAIgAgBSkDmEAgACkDCHw3AwggBSgCuEBBADYCEAsgBSgCuEAtAHhBAXFFBEAgBUIANwOoQANAIAUpA6hAIAUoArhAKQMAVARAIAUCfkKAwAAgBSgCuEApAwAgBSkDqEB9QoDAAFYNABogBSgCuEApAwAgBSkDqEB9CzcDoEAgBSAFKALUQCAFQRBqIAUpA6BAEC8iAzcDsEAgA0IAUwRAIAUoArhAQeQAaiAFKALUQBAYIAVCfzcD2EAMCwsgBSkDsEBQBEAgBSgCuEBB5ABqQRFBABAVIAVCfzcD2EAMCwUgBSAFKQOwQCAFKQOoQHw3A6hADAILAAsLCyAFKAK4QCAFKAK4QCkDADcDICAFQgA3A9hADAcLIAUpA8BAIAUoArhAKQMIIAUoArhAKQMgfVYEQCAFIAUoArhAKQMIIAUoArhAKQMgfTcDwEALIAUpA8BAUARAIAVCADcD2EAMBwsgBSgCuEAtAHhBAXEEQCAFKALUQCAFKAK4QCkDIEEAEChBAEgEQCAFKAK4QEHkAGogBSgC1EAQGCAFQn83A9hADAgLCyAFIAUoAtRAIAUoAsxAIAUpA8BAEC8iAzcDsEAgA0IAUwRAIAUoArhAQeQAakERQQAQFSAFQn83A9hADAcLIAUoArhAIgAgBSkDsEAgACkDIHw3AyAgBSkDsEBQBEAgBSgCuEApAyAgBSgCuEApAwhUBEAgBSgCuEBB5ABqQRFBABAVIAVCfzcD2EAMCAsLIAUgBSkDsEA3A9hADAYLIAUgBSgCuEApAyAgBSgCuEApAwB9IAUoArhAKQMIIAUoArhAKQMAfSAFKALMQCAFKQPAQCAFKAK4QEHkAGoQjwE3AwggBSkDCEIAUwRAIAVCfzcD2EAMBgsgBSgCuEAgBSkDCCAFKAK4QCkDAHw3AyAgBUIANwPYQAwFCyAFIAUoAsxANgIEIAUoAgQgBSgCuEBBKGogBSgCuEBB5ABqEJoBQQBIBEAgBUJ/NwPYQAwFCyAFQgA3A9hADAQLIAUgBSgCuEAsAGCsNwPYQAwDCyAFIAUoArhAKQNwNwPYQAwCCyAFIAUoArhAKQMgIAUoArhAKQMAfTcD2EAMAQsgBSgCuEBB5ABqQRxBABAVIAVCfzcD2EALIAUpA9hAIQMgBUHgwABqJAAgAwtVAQF/IwBBIGsiBCQAIAQgADYCHCAEIAE2AhggBCACNwMQIAQgAzcDCCAEKAIYIAQpAxAgBCkDCEEAQQBBAEIAIAQoAhxBCGoQfiEAIARBIGokACAAC7QDAQF/IwBBMGsiAyQAIAMgADYCJCADIAE3AxggAyACNgIUIAMgAygCJCADKQMYIAMoAhQQfyIBNwMIAkAgAVAEQCADQgA3AygMAQsgAyADKAIkKAJAIAMpAxinQQR0aigCADYCBAJAIAMpAwggAygCBCkDIHwgAykDCFoEQCADKQMIIAMoAgQpAyB8Qv///////////wBYDQELIAMoAhRBBEEWEBUgA0IANwMoDAELIAMgAygCBCkDICADKQMIfDcDCCADKAIELwEMQQhxBEAgAygCJCgCACADKQMIQQAQKEEASARAIAMoAhQgAygCJCgCABAYIANCADcDKAwCCyADKAIkKAIAIANCBBAvQgRSBEAgAygCFCADKAIkKAIAEBggA0IANwMoDAILIAMoAABB0JadwABGBEAgAyADKQMIQgR8NwMICyADIAMpAwhCDHw3AwggAygCBEEAEIABQQFxBEAgAyADKQMIQgh8NwMICyADKQMIQv///////////wBWBEAgAygCFEEEQRYQFSADQgA3AygMAgsLIAMgAykDCDcDKAsgAykDKCEBIANBMGokACABC/8BAQF/IwBBEGsiAiQAIAIgADYCDCACIAE6AAsCQCACKAIMKAIQQQ5GBEAgAigCDEE/OwEKDAELIAIoAgwoAhBBDEYEQCACKAIMQS47AQoMAQsCQCACLQALQQFxRQRAIAIoAgxBABCAAUEBcUUNAQsgAigCDEEtOwEKDAELAkAgAigCDCgCEEEIRwRAIAIoAgwvAVJBAUcNAQsgAigCDEEUOwEKDAELIAIgAigCDCgCMBBSIgA7AQggAEH//wNxQQBKBEAgAigCDCgCMCgCACACLwEIQQFrai0AAEEvRgRAIAIoAgxBFDsBCgwCCwsgAigCDEEKOwEKCyACQRBqJAALwAIBAX8jAEEwayICJAAgAiAANgIoIAJBgAI7ASYgAiABNgIgIAIgAi8BJkGAAnFBAEc6ABsgAkEeQS4gAi0AG0EBcRs2AhwCQCACKAIoQRpBHCACLQAbQQFxG6xBARAoQQBIBEAgAigCICACKAIoEBggAkF/NgIsDAELIAIgAigCKEEEQQYgAi0AG0EBcRusIAJBDmogAigCIBBBIgA2AgggAEUEQCACQX82AiwMAQsgAkEANgIUA0AgAigCFEECQQMgAi0AG0EBcRtIBEAgAiACKAIIEB5B//8DcSACKAIcajYCHCACIAIoAhRBAWo2AhQMAQsLIAIoAggQSEEBcUUEQCACKAIgQRRBABAVIAIoAggQFyACQX82AiwMAQsgAigCCBAXIAIgAigCHDYCLAsgAigCLCEAIAJBMGokACAAC/8DAQF/IwBBIGsiAiQAIAIgADYCGCACIAE2AhQCQCACKAIYKAIQQeMARwRAIAJBAToAHwwBCyACIAIoAhgoAjQgAkESakGBsgJBgAZBABBfNgIIAkAgAigCCARAIAIvARJBB04NAQsgAigCFEEVQQAQFSACQQA6AB8MAQsgAiACKAIIIAIvARKtECoiADYCDCAARQRAIAIoAhRBFEEAEBUgAkEAOgAfDAELIAJBAToABwJAAkACQCACKAIMEB5Bf2oOAgIAAQsgAigCGCkDKEIUVARAIAJBADoABwsMAQsgAigCFEEYQQAQFSACKAIMEBcgAkEAOgAfDAELIAIoAgxCAhAfLwAAQcGKAUcEQCACKAIUQRhBABAVIAIoAgwQFyACQQA6AB8MAQsCQAJAAkACQAJAIAIoAgwQjQFBf2oOAwABAgMLIAJBgQI7AQQMAwsgAkGCAjsBBAwCCyACQYMCOwEEDAELIAIoAhRBGEEAEBUgAigCDBAXIAJBADoAHwwBCyACLwESQQdHBEAgAigCFEEVQQAQFSACKAIMEBcgAkEAOgAfDAELIAIoAhggAi0AB0EBcToABiACKAIYIAIvAQQ7AVIgAigCDBAeQf//A3EhACACKAIYIAA2AhAgAigCDBAXIAJBAToAHwsgAi0AH0EBcSEAIAJBIGokACAAC7kBAQF/IwBBMGsiAiQAIAIgADsBLiACIAE7ASwgAkIANwIAIAJBADYCKCACQgA3AiAgAkIANwIYIAJCADcCECACQgA3AgggAkEANgIgIAIgAi8BLEEJdUHQAGo2AhQgAiACLwEsQQV1QQ9xQQFrNgIQIAIgAi8BLEEfcTYCDCACIAIvAS5BC3U2AgggAiACLwEuQQV1QT9xNgIEIAIgAi8BLkEBdEE+cTYCACACEAwhACACQTBqJAAgAAtMAQJ/IwBBEGsiACQAIABB2AAQGSIBNgIIAkAgAUUEQCAAQQA2AgwMAQsgACgCCBBdIAAgACgCCDYCDAsgACgCDCEBIABBEGokACABCwgAQQFBOBB9CwMAAQsL8o0BJwBBgAgLlAVObyBlcnJvcgBNdWx0aS1kaXNrIHppcCBhcmNoaXZlcyBub3Qgc3VwcG9ydGVkAFJlbmFtaW5nIHRlbXBvcmFyeSBmaWxlIGZhaWxlZABDbG9zaW5nIHppcCBhcmNoaXZlIGZhaWxlZABTZWVrIGVycm9yAFJlYWQgZXJyb3IAV3JpdGUgZXJyb3IAQ1JDIGVycm9yAENvbnRhaW5pbmcgemlwIGFyY2hpdmUgd2FzIGNsb3NlZABObyBzdWNoIGZpbGUARmlsZSBhbHJlYWR5IGV4aXN0cwBDYW4ndCBvcGVuIGZpbGUARmFpbHVyZSB0byBjcmVhdGUgdGVtcG9yYXJ5IGZpbGUAWmxpYiBlcnJvcgBNYWxsb2MgZmFpbHVyZQBFbnRyeSBoYXMgYmVlbiBjaGFuZ2VkAENvbXByZXNzaW9uIG1ldGhvZCBub3Qgc3VwcG9ydGVkAFByZW1hdHVyZSBlbmQgb2YgZmlsZQBJbnZhbGlkIGFyZ3VtZW50AE5vdCBhIHppcCBhcmNoaXZlAEludGVybmFsIGVycm9yAFppcCBhcmNoaXZlIGluY29uc2lzdGVudABDYW4ndCByZW1vdmUgZmlsZQBFbnRyeSBoYXMgYmVlbiBkZWxldGVkAEVuY3J5cHRpb24gbWV0aG9kIG5vdCBzdXBwb3J0ZWQAUmVhZC1vbmx5IGFyY2hpdmUATm8gcGFzc3dvcmQgcHJvdmlkZWQAV3JvbmcgcGFzc3dvcmQgcHJvdmlkZWQAT3BlcmF0aW9uIG5vdCBzdXBwb3J0ZWQAUmVzb3VyY2Ugc3RpbGwgaW4gdXNlAFRlbGwgZXJyb3IAQ29tcHJlc3NlZCBkYXRhIGludmFsaWQAQaENC4ABBAAACQQAAC8EAABOBAAAaQQAAHQEAAB/BAAAiwQAAJUEAAC3BAAAxAQAANgEAADoBAAACQUAABQFAAAjBQAAOgUAAFsFAABxBQAAggUAAJQFAACjBQAAvAUAAM4FAADlBQAABQYAABcGAAAsBgAARAYAAFwGAAByBgAAfQYAACAAQbgOCxEBAAAAAQAAAAEAAAABAAAAAQBB3A4LCQEAAAABAAAAAgBBiA8LAQEAQagPCwEBAEG0DwuSRZYwB3csYQ7uulEJmRnEbQeP9GpwNaVj6aOVZJ4yiNsOpLjceR7p1eCI2dKXK0y2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AAgAZgAIAOYACAAWAAgAlgAIAFYACADWAAgANgAIALYACAB2AAgA9gAIAA4ACACOAAgATgAIAM4ACAAuAAgArgAIAG4ACADuAAgAHgAIAJ4ACABeAAgA3gAIAD4ACAC+AAgAfgAIAP4ACAABAAgAgQAIAEEACADBAAgAIQAIAKEACABhAAgA4QAIABEACACRAAgAUQAIANEACAAxAAgAsQAIAHEACADxAAgACQAIAIkACABJAAgAyQAIACkACACpAAgAaQAIAOkACAAZAAgAmQAIAFkACADZAAgAOQAIALkACAB5AAgA+QAIAAUACACFAAgARQAIAMUACAAlAAgApQAIAGUACADlAAgAFQAIAJUACABVAAgA1QAIADUACAC1AAgAdQAIAPUACAANAAgAjQAIAE0ACADNAAgALQAIAK0ACABtAAgA7QAIAB0ACACdAAgAXQAIAN0ACAA9AAgAvQAIAH0ACAD9AAgAEwAJABMBCQCTAAkAkwEJAFMACQBTAQkA0wAJANMBCQAzAAkAMwEJALMACQCzAQkAcwAJAHMBCQDzAAkA8wEJAAsACQALAQkAiwAJAIsBCQBLAAkASwEJAMsACQDLAQkAKwAJACsBCQCrAAkAqwEJAGsACQBrAQkA6wAJAOsBCQAbAAkAGwEJAJsACQCbAQkAWwAJAFsBCQDbAAkA2wEJADsACQA7AQkAuwAJALsBCQB7AAkAewEJAPsACQD7AQkABwAJAAcBCQCHAAkAhwEJAEcACQBHAQkAxwAJAMcBCQAnAAkAJwEJAKcACQCnAQkAZwAJAGcBCQDnAAkA5wEJABcACQAXAQkAlwAJAJcBCQBXAAkAVwEJANcACQDXAQkANwAJADcBCQC3AAkAtwEJAHcACQB3AQkA9wAJAPcBCQAPAAkADwEJAI8ACQCPAQkATwAJAE8BCQDPAAkAzwEJAC8ACQAvAQkArwAJAK8BCQBvAAkAbwEJAO8ACQDvAQkAHwAJAB8BCQCfAAkAnwEJAF8ACQBfAQkA3wAJAN8BCQA/AAkAPwEJAL8ACQC/AQkAfwAJAH8BCQD/AAkA/wEJAAAABwBAAAcAIAAHAGAABwAQAAcAUAAHADAABwBwAAcACAAHAEgABwAoAAcAaAAHABgABwBYAAcAOAAHAHgABwAEAAcARAAHACQABwBkAAcAFAAHAFQABwA0AAcAdAAHAAMACACDAAgAQwAIAMMACAAjAAgAowAIAGMACADjAAgAAAAFABAABQAIAAUAGAAFAAQABQAUAAUADAAFABwABQACAAUAEgAFAAoABQAaAAUABgAFABYABQAOAAUAHgAFAAEABQARAAUACQAFABkABQAFAAUAFQAFAA0ABQAdAAUAAwAFABMABQALAAUAGwAFAAcABQAXAAUAQeDlAAtNAQAAAAEAAAABAAAAAQAAAAIAAAACAAAAAgAAAAIAAAADAAAAAwAAAAMAAAADAAAABAAAAAQAAAAEAAAABAAAAAUAAAAFAAAABQAAAAUAQdDmAAtlAQAAAAEAAAACAAAAAgAAAAMAAAADAAAABAAAAAQAAAAFAAAABQAAAAYAAAAGAAAABwAAAAcAAAAIAAAACAAAAAkAAAAJAAAACgAAAAoAAAALAAAACwAAAAwAAAAMAAAADQAAAA0AQYDoAAsjAgAAAAMAAAAHAAAAAAAAABAREgAIBwkGCgULBAwDDQIOAQ8AQbToAAtpAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAKAAAADAAAAA4AAAAQAAAAFAAAABgAAAAcAAAAIAAAACgAAAAwAAAAOAAAAEAAAABQAAAAYAAAAHAAAACAAAAAoAAAAMAAAADgAEG06QALegEAAAACAAAAAwAAAAQAAAAGAAAACAAAAAwAAAAQAAAAGAAAACAAAAAwAAAAQAAAAGAAAACAAAAAwAAAAAABAACAAQAAAAIAAAADAAAABAAAAAYAAAAIAAAADAAAABAAAAAYAAAAIAAAADAAAABAAAAAYAAAMS4yLjExAEG46gALbQcAAAAEAAQACAAEAAgAAAAEAAUAEAAIAAgAAAAEAAYAIAAgAAgAAAAEAAQAEAAQAAkAAAAIABAAIAAgAAkAAAAIABAAgACAAAkAAAAIACAAgAAAAQkAAAAgAIAAAgEABAkAAAAgAAIBAgEAEAkAQbDrAAvWAgMABAAFAAYABwAIAAkACgALAA0ADwARABMAFwAbAB8AIwArADMAOwBDAFMAYwBzAIMAowDDAOMAAgEAAAAAAAAQABAAEAAQABAAEAAQABAAEQARABEAEQASABIAEgASABMAEwATABMAFAAUABQAFAAVABUAFQAVABAATQDKAAAAAQACAAMABAAFAAcACQANABEAGQAhADEAQQBhAIEAwQABAYEBAQIBAwEEAQYBCAEMARABGAEgATABQAFgAAAAABAAEAAQABAAEQARABIAEgATABMAFAAUABUAFQAWABYAFwAXABgAGAAZABkAGgAaABsAGwAcABwAHQAdAEAAQABpbnZhbGlkIGRpc3RhbmNlIHRvbyBmYXIgYmFjawBpbnZhbGlkIGRpc3RhbmNlIGNvZGUAaW52YWxpZCBsaXRlcmFsL2xlbmd0aCBjb2RlADEuMi4xMQBBkO4AC/IDEAARABIAAAAIAAcACQAGAAoABQALAAQADAADAA0AAgAOAAEADwBpbmNvcnJlY3QgaGVhZGVyIGNoZWNrAHVua25vd24gY29tcHJlc3Npb24gbWV0aG9kAGludmFsaWQgd2luZG93IHNpemUAdW5rbm93biBoZWFkZXIgZmxhZ3Mgc2V0AGhlYWRlciBjcmMgbWlzbWF0Y2gAaW52YWxpZCBibG9jayB0eXBlAGludmFsaWQgc3RvcmVkIGJsb2NrIGxlbmd0aHMAdG9vIG1hbnkgbGVuZ3RoIG9yIGRpc3RhbmNlIHN5bWJvbHMAaW52YWxpZCBjb2RlIGxlbmd0aHMgc2V0AGludmFsaWQgYml0IGxlbmd0aCByZXBlYXQAaW52YWxpZCBjb2RlIC0tIG1pc3NpbmcgZW5kLW9mLWJsb2NrAGludmFsaWQgbGl0ZXJhbC9sZW5ndGhzIHNldABpbnZhbGlkIGRpc3RhbmNlcyBzZXQAaW52YWxpZCBsaXRlcmFsL2xlbmd0aCBjb2RlAGludmFsaWQgZGlzdGFuY2UgY29kZQBpbnZhbGlkIGRpc3RhbmNlIHRvbyBmYXIgYmFjawBpbmNvcnJlY3QgZGF0YSBjaGVjawBpbmNvcnJlY3QgbGVuZ3RoIGNoZWNrAEGQ8gALlxFgBwAAAAhQAAAIEAAUCHMAEgcfAAAIcAAACDAAAAnAABAHCgAACGAAAAggAAAJoAAACAAAAAiAAAAIQAAACeAAEAcGAAAIWAAACBgAAAmQABMHOwAACHgAAAg4AAAJ0AARBxEAAAhoAAAIKAAACbAAAAgIAAAIiAAACEgAAAnwABAHBAAACFQAAAgUABUI4wATBysAAAh0AAAINAAACcgAEQcNAAAIZAAACCQAAAmoAAAIBAAACIQAAAhEAAAJ6AAQBwgAAAhcAAAIHAAACZgAFAdTAAAIfAAACDwAAAnYABIHFwAACGwAAAgsAAAJuAAACAwAAAiMAAAITAAACfgAEAcDAAAIUgAACBIAFQijABMHIwAACHIAAAgyAAAJxAARBwsAAAhiAAAIIgAACaQAAAgCAAAIggAACEIAAAnkABAHBwAACFoAAAgaAAAJlAAUB0MAAAh6AAAIOgAACdQAEgcTAAAIagAACCoAAAm0AAAICgAACIoAAAhKAAAJ9AAQBwUAAAhWAAAIFgBACAAAEwczAAAIdgAACDYAAAnMABEHDwAACGYAAAgmAAAJrAAACAYAAAiGAAAIRgAACewAEAcJAAAIXgAACB4AAAmcABQHYwAACH4AAAg+AAAJ3AASBxsAAAhuAAAILgAACbwAAAgOAAAIjgAACE4AAAn8AGAHAAAACFEAAAgRABUIgwASBx8AAAhxAAAIMQAACcIAEAcKAAAIYQAACCEAAAmiAAAIAQAACIEAAAhBAAAJ4gAQBwYAAAhZAAAIGQAACZIAEwc7AAAIeQAACDkAAAnSABEHEQAACGkAAAgpAAAJsgAACAkAAAiJAAAISQAACfIAEAcEAAAIVQAACBUAEAgCARMHKwAACHUAAAg1AAAJygARBw0AAAhlAAAIJQAACaoAAAgFAAAIhQAACEUAAAnqABAHCAAACF0AAAgdAAAJmgAUB1MAAAh9AAAIPQAACdoAEgcXAAAIbQAACC0AAAm6AAAIDQAACI0AAAhNAAAJ+gAQBwMAAAhTAAAIEwAVCMMAEwcjAAAIcwAACDMAAAnGABEHCwAACGMAAAgjAAAJpgAACAMAAAiDAAAIQwAACeYAEAcHAAAIWwAACBsAAAmWABQHQwAACHsAAAg7AAAJ1gASBxMAAAhrAAAIKwAACbYAAAgLAAAIiwAACEsAAAn2ABAHBQAACFcAAAgXAEAIAAATBzMAAAh3AAAINwAACc4AEQcPAAAIZwAACCcAAAmuAAAIBwAACIcAAAhHAAAJ7gAQBwkAAAhfAAAIHwAACZ4AFAdjAAAIfwAACD8AAAneABIHGwAACG8AAAgvAAAJvgAACA8AAAiPAAAITwAACf4AYAcAAAAIUAAACBAAFAhzABIHHwAACHAAAAgwAAAJwQAQBwoAAAhgAAAIIAAACaEAAAgAAAAIgAAACEAAAAnhABAHBgAACFgAAAgYAAAJkQATBzsAAAh4AAAIOAAACdEAEQcRAAAIaAAACCgAAAmxAAAICAAACIgAAAhIAAAJ8QAQBwQAAAhUAAAIFAAVCOMAEwcrAAAIdAAACDQAAAnJABEHDQAACGQAAAgkAAAJqQAACAQAAAiEAAAIRAAACekAEAcIAAAIXAAACBwAAAmZABQHUwAACHwAAAg8AAAJ2QASBxcAAAhsAAAILAAACbkAAAgMAAAIjAAACEwAAAn5ABAHAwAACFIAAAgSABUIowATByMAAAhyAAAIMgAACcUAEQcLAAAIYgAACCIAAAmlAAAIAgAACIIAAAhCAAAJ5QAQBwcAAAhaAAAIGgAACZUAFAdDAAAIegAACDoAAAnVABIHEwAACGoAAAgqAAAJtQAACAoAAAiKAAAISgAACfUAEAcFAAAIVgAACBYAQAgAABMHMwAACHYAAAg2AAAJzQARBw8AAAhmAAAIJgAACa0AAAgGAAAIhgAACEYAAAntABAHCQAACF4AAAgeAAAJnQAUB2MAAAh+AAAIPgAACd0AEgcbAAAIbgAACC4AAAm9AAAIDgAACI4AAAhOAAAJ/QBgBwAAAAhRAAAIEQAVCIMAEgcfAAAIcQAACDEAAAnDABAHCgAACGEAAAghAAAJowAACAEAAAiBAAAIQQAACeMAEAcGAAAIWQAACBkAAAmTABMHOwAACHkAAAg5AAAJ0wARBxEAAAhpAAAIKQAACbMAAAgJAAAIiQAACEkAAAnzABAHBAAACFUAAAgVABAIAgETBysAAAh1AAAINQAACcsAEQcNAAAIZQAACCUAAAmrAAAIBQAACIUAAAhFAAAJ6wAQBwgAAAhdAAAIHQAACZsAFAdTAAAIfQAACD0AAAnbABIHFwAACG0AAAgtAAAJuwAACA0AAAiNAAAITQAACfsAEAcDAAAIUwAACBMAFQjDABMHIwAACHMAAAgzAAAJxwARBwsAAAhjAAAIIwAACacAAAgDAAAIgwAACEMAAAnnABAHBwAACFsAAAgbAAAJlwAUB0MAAAh7AAAIOwAACdcAEgcTAAAIawAACCsAAAm3AAAICwAACIsAAAhLAAAJ9wAQBwUAAAhXAAAIFwBACAAAEwczAAAIdwAACDcAAAnPABEHDwAACGcAAAgnAAAJrwAACAcAAAiHAAAIRwAACe8AEAcJAAAIXwAACB8AAAmfABQHYwAACH8AAAg/AAAJ3wASBxsAAAhvAAAILwAACb8AAAgPAAAIjwAACE8AAAn/ABAFAQAXBQEBEwURABsFARARBQUAGQUBBBUFQQAdBQFAEAUDABgFAQIUBSEAHAUBIBIFCQAaBQEIFgWBAEAFAAAQBQIAFwWBARMFGQAbBQEYEQUHABkFAQYVBWEAHQUBYBAFBAAYBQEDFAUxABwFATASBQ0AGgUBDBYFwQBABQAAMS4yLjExAC0rICAgMFgweAAobnVsbCkAQbCDAQtBEQAKABEREQAAAAAFAAAAAAAACQAAAAALAAAAAAAAAAARAA8KERERAwoHAAEACQsLAAAJBgsAAAsABhEAAAAREREAQYGEAQshCwAAAAAAAAAAEQAKChEREQAKAAACAAkLAAAACQALAAALAEG7hAELAQwAQceEAQsVDAAAAAAMAAAAAAkMAAAAAAAMAAAMAEH1hAELAQ4AQYGFAQsVDQAAAAQNAAAAAAkOAAAAAAAOAAAOAEGvhQELARAAQbuFAQseDwAAAAAPAAAAAAkQAAAAAAAQAAAQAAASAAAAEhISAEHyhQELDhIAAAASEhIAAAAAAAAJAEGjhgELAQsAQa+GAQsVCgAAAAAKAAAAAAkLAAAAAAALAAALAEHdhgELAQwAQemGAQtLDAAAAAAMAAAAAAkMAAAAAAAMAAAMAAAwMTIzNDU2Nzg5QUJDREVGLTBYKzBYIDBYLTB4KzB4IDB4AGluZgBJTkYAbmFuAE5BTgAuAEHchwELARcAQYOIAQsF//////8AQdCIAQtXGRJEOwI/LEcUPTMwChsGRktFNw9JDo4XA0AdPGkrNh9KLRwBICUpIQgMFRYiLhA4Pgs0MRhkdHV2L0EJfzkRI0MyQomKiwUEJignDSoeNYwHGkiTE5SVAEGwiQEL3Q5JbGxlZ2FsIGJ5dGUgc2VxdWVuY2UARG9tYWluIGVycm9yAFJlc3VsdCBub3QgcmVwcmVzZW50YWJsZQBOb3QgYSB0dHkAUGVybWlzc2lvbiBkZW5pZWQAT3BlcmF0aW9uIG5vdCBwZXJtaXR0ZWQATm8gc3VjaCBmaWxlIG9yIGRpcmVjdG9yeQBObyBzdWNoIHByb2Nlc3MARmlsZSBleGlzdHMAVmFsdWUgdG9vIGxhcmdlIGZvciBkYXRhIHR5cGUATm8gc3BhY2UgbGVmdCBvbiBkZXZpY2UAT3V0IG9mIG1lbW9yeQBSZXNvdXJjZSBidXN5AEludGVycnVwdGVkIHN5c3RlbSBjYWxsAFJlc291cmNlIHRlbXBvcmFyaWx5IHVuYXZhaWxhYmxlAEludmFsaWQgc2VlawBDcm9zcy1kZXZpY2UgbGluawBSZWFkLW9ubHkgZmlsZSBzeXN0ZW0ARGlyZWN0b3J5IG5vdCBlbXB0eQBDb25uZWN0aW9uIHJlc2V0IGJ5IHBlZXIAT3BlcmF0aW9uIHRpbWVkIG91dABDb25uZWN0aW9uIHJlZnVzZWQASG9zdCBpcyBkb3duAEhvc3QgaXMgdW5yZWFjaGFibGUAQWRkcmVzcyBpbiB1c2UAQnJva2VuIHBpcGUASS9PIGVycm9yAE5vIHN1Y2ggZGV2aWNlIG9yIGFkZHJlc3MAQmxvY2sgZGV2aWNlIHJlcXVpcmVkAE5vIHN1Y2ggZGV2aWNlAE5vdCBhIGRpcmVjdG9yeQBJcyBhIGRpcmVjdG9yeQBUZXh0IGZpbGUgYnVzeQBFeGVjIGZvcm1hdCBlcnJvcgBJbnZhbGlkIGFyZ3VtZW50AEFyZ3VtZW50IGxpc3QgdG9vIGxvbmcAU3ltYm9saWMgbGluayBsb29wAEZpbGVuYW1lIHRvbyBsb25nAFRvbyBtYW55IG9wZW4gZmlsZXMgaW4gc3lzdGVtAE5vIGZpbGUgZGVzY3JpcHRvcnMgYXZhaWxhYmxlAEJhZCBmaWxlIGRlc2NyaXB0b3IATm8gY2hpbGQgcHJvY2VzcwBCYWQgYWRkcmVzcwBGaWxlIHRvbyBsYXJnZQBUb28gbWFueSBsaW5rcwBObyBsb2NrcyBhdmFpbGFibGUAUmVzb3VyY2UgZGVhZGxvY2sgd291bGQgb2NjdXIAU3RhdGUgbm90IHJlY292ZXJhYmxlAFByZXZpb3VzIG93bmVyIGRpZWQAT3BlcmF0aW9uIGNhbmNlbGVkAEZ1bmN0aW9uIG5vdCBpbXBsZW1lbnRlZABObyBtZXNzYWdlIG9mIGRlc2lyZWQgdHlwZQBJZGVudGlmaWVyIHJlbW92ZWQARGV2aWNlIG5vdCBhIHN0cmVhbQBObyBkYXRhIGF2YWlsYWJsZQBEZXZpY2UgdGltZW91dABPdXQgb2Ygc3RyZWFtcyByZXNvdXJjZXMATGluayBoYXMgYmVlbiBzZXZlcmVkAFByb3RvY29sIGVycm9yAEJhZCBtZXNzYWdlAEZpbGUgZGVzY3JpcHRvciBpbiBiYWQgc3RhdGUATm90IGEgc29ja2V0AERlc3RpbmF0aW9uIGFkZHJlc3MgcmVxdWlyZWQATWVzc2FnZSB0b28gbGFyZ2UAUHJvdG9jb2wgd3JvbmcgdHlwZSBmb3Igc29ja2V0AFByb3RvY29sIG5vdCBhdmFpbGFibGUAUHJvdG9jb2wgbm90IHN1cHBvcnRlZABTb2NrZXQgdHlwZSBub3Qgc3VwcG9ydGVkAE5vdCBzdXBwb3J0ZWQAUHJvdG9jb2wgZmFtaWx5IG5vdCBzdXBwb3J0ZWQAQWRkcmVzcyBmYW1pbHkgbm90IHN1cHBvcnRlZCBieSBwcm90b2NvbABBZGRyZXNzIG5vdCBhdmFpbGFibGUATmV0d29yayBpcyBkb3duAE5ldHdvcmsgdW5yZWFjaGFibGUAQ29ubmVjdGlvbiByZXNldCBieSBuZXR3b3JrAENvbm5lY3Rpb24gYWJvcnRlZABObyBidWZmZXIgc3BhY2UgYXZhaWxhYmxlAFNvY2tldCBpcyBjb25uZWN0ZWQAU29ja2V0IG5vdCBjb25uZWN0ZWQAQ2Fubm90IHNlbmQgYWZ0ZXIgc29ja2V0IHNodXRkb3duAE9wZXJhdGlvbiBhbHJlYWR5IGluIHByb2dyZXNzAE9wZXJhdGlvbiBpbiBwcm9ncmVzcwBTdGFsZSBmaWxlIGhhbmRsZQBSZW1vdGUgSS9PIGVycm9yAFF1b3RhIGV4Y2VlZGVkAE5vIG1lZGl1bSBmb3VuZABXcm9uZyBtZWRpdW0gdHlwZQBObyBlcnJvciBpbmZvcm1hdGlvbgAAVW5rbm93biBlcnJvciAlZAAlcyVzJXMAADogAC9wcm9jL3NlbGYvZmQvAC9kZXYvdXJhbmRvbQByd2EAJXMuWFhYWFhYAHIrYgByYgBQSwUGAEGQmAELTgoAAAALAAAADAAAAA0AAAAOAAAADwAAABAAAAARAAAAEgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAABAAAACAAAABBMAAAwTABBkJoBCwJQUABByJoBCwkfAAAAZE0AAAMAQeSaAQuMAS30UVjPjLHARva1yykxA8cEW3AwtF39IHh/i5rYWSlQaEiJq6dWA2z/t82IP9R3tCulo3DxuuSo/EGD/dlv4Yp6Ly10lgcfDQleA3YscPdApSynb1dBqKp036BYZANKx8Q8U66vXxgEFbHjbSiGqwykv0Pw6VCBOVcWUjf/////////////////////";
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}
function getBinary() {
  try {
    if (wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    var binary = tryParseAsDataURI(wasmBinaryFile);
    if (binary) {
      return binary;
    }
    if (readBinary) {
      return readBinary(wasmBinaryFile);
    } else {
      throw "sync fetching of the wasm failed: you can preload it to Module['wasmBinary'] manually, or emcc.py will do that for you when generating HTML (but not JS)";
    }
  } catch (err) {
    abort(err);
  }
}
function createWasm() {
  var info = { a: asmLibraryArg };
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    Module["asm"] = exports;
    removeRunDependency("wasm-instantiate");
  }
  addRunDependency("wasm-instantiate");
  function instantiateSync() {
    var instance;
    var module;
    var binary;
    try {
      binary = getBinary();
      module = new WebAssembly.Module(binary);
      instance = new WebAssembly.Instance(module, info);
    } catch (e) {
      var str = e.toString();
      err("failed to compile wasm module: " + str);
      if (
        str.indexOf("imported Memory") >= 0 ||
        str.indexOf("memory import") >= 0
      ) {
        err(
          "Memory size incompatibility issues may be due to changing INITIAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set INITIAL_MEMORY at runtime to something smaller than it was at compile time)."
        );
      }
      throw e;
    }
    receiveInstance(instance, module);
  }
  if (Module["instantiateWasm"]) {
    try {
      var exports = Module["instantiateWasm"](info, receiveInstance);
      return exports;
    } catch (e) {
      err("Module.instantiateWasm callback failed with error: " + e);
      return false;
    }
  }
  instantiateSync();
  return Module["asm"];
}
var tempDouble;
var tempI64;
__ATINIT__.push({
  func: function() {
    ___wasm_call_ctors();
  }
});
function demangle(func) {
  return func;
}
function demangleAll(text) {
  var regex = /\b_Z[\w\d_]+/g;
  return text.replace(regex, function(x) {
    var y = demangle(x);
    return x === y ? x : y + " [" + x + "]";
  });
}
function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    try {
      throw new Error();
    } catch (e) {
      err = e;
    }
    if (!err.stack) {
      return "(no stack trace available)";
    }
  }
  return err.stack.toString();
}
function stackTrace() {
  var js = jsStackTrace();
  if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
  return demangleAll(js);
}
var PATH = {
  splitPath: function(filename) {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: function(parts, allowAboveRoot) {
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    if (allowAboveRoot) {
      for (; up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: function(path) {
    var isAbsolute = path.charAt(0) === "/",
      trailingSlash = path.substr(-1) === "/";
    path = PATH.normalizeArray(
      path.split("/").filter(function(p) {
        return !!p;
      }),
      !isAbsolute
    ).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: function(path) {
    var result = PATH.splitPath(path),
      root = result[0],
      dir = result[1];
    if (!root && !dir) {
      return ".";
    }
    if (dir) {
      dir = dir.substr(0, dir.length - 1);
    }
    return root + dir;
  },
  basename: function(path) {
    if (path === "/") return "/";
    var lastSlash = path.lastIndexOf("/");
    if (lastSlash === -1) return path;
    return path.substr(lastSlash + 1);
  },
  extname: function(path) {
    return PATH.splitPath(path)[3];
  },
  join: function() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return PATH.normalize(paths.join("/"));
  },
  join2: function(l, r) {
    return PATH.normalize(l + "/" + r);
  }
};
function setErrNo(value) {
  HEAP32[___errno_location() >> 2] = value;
  return value;
}
var PATH_FS = {
  resolve: function() {
    var resolvedPath = "",
      resolvedAbsolute = false;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = i >= 0 ? arguments[i] : FS.cwd();
      if (typeof path !== "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = path.charAt(0) === "/";
    }
    resolvedPath = PATH.normalizeArray(
      resolvedPath.split("/").filter(function(p) {
        return !!p;
      }),
      !resolvedAbsolute
    ).join("/");
    return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
  },
  relative: function(from, to) {
    from = PATH_FS.resolve(from).substr(1);
    to = PATH_FS.resolve(to).substr(1);
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
};
var TTY = {
  ttys: [],
  init: function() {},
  shutdown: function() {},
  register: function(dev, ops) {
    TTY.ttys[dev] = { input: [], output: [], ops: ops };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open: function(stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close: function(stream) {
      stream.tty.ops.flush(stream.tty);
    },
    flush: function(stream) {
      stream.tty.ops.flush(stream.tty);
    },
    read: function(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.timestamp = Date.now();
      }
      return bytesRead;
    },
    write: function(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.timestamp = Date.now();
      }
      return i;
    }
  },
  default_tty_ops: {
    get_char: function(tty) {
      if (!tty.input.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          var BUFSIZE = 256;
          var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
          var bytesRead = 0;
          try {
            bytesRead = nodeFS.readSync(
              process.stdin.fd,
              buf,
              0,
              BUFSIZE,
              null
            );
          } catch (e) {
            if (e.toString().indexOf("EOF") != -1) bytesRead = 0;
            else throw e;
          }
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString("utf-8");
          } else {
            result = null;
          }
        } else if (
          typeof window != "undefined" &&
          typeof window.prompt == "function"
        ) {
          result = window.prompt("Input: ");
          if (result !== null) {
            result += "\n";
          }
        } else if (typeof readline == "function") {
          result = readline();
          if (result !== null) {
            result += "\n";
          }
        }
        if (!result) {
          return null;
        }
        tty.input = intArrayFromString(result, true);
      }
      return tty.input.shift();
    },
    put_char: function(tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    flush: function(tty) {
      if (tty.output && tty.output.length > 0) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    }
  },
  default_tty1_ops: {
    put_char: function(tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    flush: function(tty) {
      if (tty.output && tty.output.length > 0) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    }
  }
};
var MEMFS = {
  ops_table: null,
  mount: function(mount) {
    return MEMFS.createNode(null, "/", 16384 | 511, 0);
  },
  createNode: function(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      throw new FS.ErrnoError(63);
    }
    if (!MEMFS.ops_table) {
      MEMFS.ops_table = {
        dir: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink
          },
          stream: { llseek: MEMFS.stream_ops.llseek }
        },
        file: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          },
          stream: {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            allocate: MEMFS.stream_ops.allocate,
            mmap: MEMFS.stream_ops.mmap,
            msync: MEMFS.stream_ops.msync
          }
        },
        link: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink
          },
          stream: {}
        },
        chrdev: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          },
          stream: FS.chrdev_stream_ops
        }
      };
    }
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      node.usedBytes = 0;
      node.contents = null;
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.timestamp = Date.now();
    if (parent) {
      parent.contents[name] = node;
    }
    return node;
  },
  getFileDataAsRegularArray: function(node) {
    if (node.contents && node.contents.subarray) {
      var arr = [];
      for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
      return arr;
    }
    return node.contents;
  },
  getFileDataAsTypedArray: function(node) {
    if (!node.contents) return new Uint8Array(0);
    if (node.contents.subarray)
      return node.contents.subarray(0, node.usedBytes);
    return new Uint8Array(node.contents);
  },
  expandFileStorage: function(node, newCapacity) {
    var prevCapacity = node.contents ? node.contents.length : 0;
    if (prevCapacity >= newCapacity) return;
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(
      newCapacity,
      (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0
    );
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
    var oldContents = node.contents;
    node.contents = new Uint8Array(newCapacity);
    if (node.usedBytes > 0)
      node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
    return;
  },
  resizeFileStorage: function(node, newSize) {
    if (node.usedBytes == newSize) return;
    if (newSize == 0) {
      node.contents = null;
      node.usedBytes = 0;
      return;
    }
    if (!node.contents || node.contents.subarray) {
      var oldContents = node.contents;
      node.contents = new Uint8Array(newSize);
      if (oldContents) {
        node.contents.set(
          oldContents.subarray(0, Math.min(newSize, node.usedBytes))
        );
      }
      node.usedBytes = newSize;
      return;
    }
    if (!node.contents) node.contents = [];
    if (node.contents.length > newSize) node.contents.length = newSize;
    else while (node.contents.length < newSize) node.contents.push(0);
    node.usedBytes = newSize;
  },
  node_ops: {
    getattr: function(node) {
      var attr = {};
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.timestamp);
      attr.mtime = new Date(node.timestamp);
      attr.ctime = new Date(node.timestamp);
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr: function(node, attr) {
      if (attr.mode !== undefined) {
        node.mode = attr.mode;
      }
      if (attr.timestamp !== undefined) {
        node.timestamp = attr.timestamp;
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup: function(parent, name) {
      throw FS.genericErrors[44];
    },
    mknod: function(parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename: function(old_node, new_dir, new_name) {
      if (FS.isDir(old_node.mode)) {
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}
        if (new_node) {
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
      }
      delete old_node.parent.contents[old_node.name];
      old_node.name = new_name;
      new_dir.contents[new_name] = old_node;
      old_node.parent = new_dir;
    },
    unlink: function(parent, name) {
      delete parent.contents[name];
    },
    rmdir: function(parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
    },
    readdir: function(node) {
      var entries = [".", ".."];
      for (var key in node.contents) {
        if (!node.contents.hasOwnProperty(key)) {
          continue;
        }
        entries.push(key);
      }
      return entries;
    },
    symlink: function(parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink: function(node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    }
  },
  stream_ops: {
    read: function(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      if (size > 8 && contents.subarray) {
        buffer.set(contents.subarray(position, position + size), offset);
      } else {
        for (var i = 0; i < size; i++)
          buffer[offset + i] = contents[position + i];
      }
      return size;
    },
    write: function(stream, buffer, offset, length, position, canOwn) {
      if (buffer.buffer === HEAP8.buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.timestamp = Date.now();
      if (buffer.subarray && (!node.contents || node.contents.subarray)) {
        if (canOwn) {
          node.contents = buffer.subarray(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (node.usedBytes === 0 && position === 0) {
          node.contents = buffer.slice(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (position + length <= node.usedBytes) {
          node.contents.set(buffer.subarray(offset, offset + length), position);
          return length;
        }
      }
      MEMFS.expandFileStorage(node, position + length);
      if (node.contents.subarray && buffer.subarray)
        node.contents.set(buffer.subarray(offset, offset + length), position);
      else {
        for (var i = 0; i < length; i++) {
          node.contents[position + i] = buffer[offset + i];
        }
      }
      node.usedBytes = Math.max(node.usedBytes, position + length);
      return length;
    },
    llseek: function(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    allocate: function(stream, offset, length) {
      MEMFS.expandFileStorage(stream.node, offset + length);
      stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
    },
    mmap: function(stream, address, length, position, prot, flags) {
      assert(address === 0);
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
      if (!(flags & 2) && contents.buffer === buffer) {
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        if (position > 0 || position + length < contents.length) {
          if (contents.subarray) {
            contents = contents.subarray(position, position + length);
          } else {
            contents = Array.prototype.slice.call(
              contents,
              position,
              position + length
            );
          }
        }
        allocated = true;
        ptr = _malloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        HEAP8.set(contents, ptr);
      }
      return { ptr: ptr, allocated: allocated };
    },
    msync: function(stream, buffer, offset, length, mmapFlags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      if (mmapFlags & 2) {
        return 0;
      }
      var bytesWritten = MEMFS.stream_ops.write(
        stream,
        buffer,
        0,
        length,
        offset,
        false
      );
      return 0;
    }
  }
};
var ERRNO_CODES = {
  EPERM: 63,
  ENOENT: 44,
  ESRCH: 71,
  EINTR: 27,
  EIO: 29,
  ENXIO: 60,
  E2BIG: 1,
  ENOEXEC: 45,
  EBADF: 8,
  ECHILD: 12,
  EAGAIN: 6,
  EWOULDBLOCK: 6,
  ENOMEM: 48,
  EACCES: 2,
  EFAULT: 21,
  ENOTBLK: 105,
  EBUSY: 10,
  EEXIST: 20,
  EXDEV: 75,
  ENODEV: 43,
  ENOTDIR: 54,
  EISDIR: 31,
  EINVAL: 28,
  ENFILE: 41,
  EMFILE: 33,
  ENOTTY: 59,
  ETXTBSY: 74,
  EFBIG: 22,
  ENOSPC: 51,
  ESPIPE: 70,
  EROFS: 69,
  EMLINK: 34,
  EPIPE: 64,
  EDOM: 18,
  ERANGE: 68,
  ENOMSG: 49,
  EIDRM: 24,
  ECHRNG: 106,
  EL2NSYNC: 156,
  EL3HLT: 107,
  EL3RST: 108,
  ELNRNG: 109,
  EUNATCH: 110,
  ENOCSI: 111,
  EL2HLT: 112,
  EDEADLK: 16,
  ENOLCK: 46,
  EBADE: 113,
  EBADR: 114,
  EXFULL: 115,
  ENOANO: 104,
  EBADRQC: 103,
  EBADSLT: 102,
  EDEADLOCK: 16,
  EBFONT: 101,
  ENOSTR: 100,
  ENODATA: 116,
  ETIME: 117,
  ENOSR: 118,
  ENONET: 119,
  ENOPKG: 120,
  EREMOTE: 121,
  ENOLINK: 47,
  EADV: 122,
  ESRMNT: 123,
  ECOMM: 124,
  EPROTO: 65,
  EMULTIHOP: 36,
  EDOTDOT: 125,
  EBADMSG: 9,
  ENOTUNIQ: 126,
  EBADFD: 127,
  EREMCHG: 128,
  ELIBACC: 129,
  ELIBBAD: 130,
  ELIBSCN: 131,
  ELIBMAX: 132,
  ELIBEXEC: 133,
  ENOSYS: 52,
  ENOTEMPTY: 55,
  ENAMETOOLONG: 37,
  ELOOP: 32,
  EOPNOTSUPP: 138,
  EPFNOSUPPORT: 139,
  ECONNRESET: 15,
  ENOBUFS: 42,
  EAFNOSUPPORT: 5,
  EPROTOTYPE: 67,
  ENOTSOCK: 57,
  ENOPROTOOPT: 50,
  ESHUTDOWN: 140,
  ECONNREFUSED: 14,
  EADDRINUSE: 3,
  ECONNABORTED: 13,
  ENETUNREACH: 40,
  ENETDOWN: 38,
  ETIMEDOUT: 73,
  EHOSTDOWN: 142,
  EHOSTUNREACH: 23,
  EINPROGRESS: 26,
  EALREADY: 7,
  EDESTADDRREQ: 17,
  EMSGSIZE: 35,
  EPROTONOSUPPORT: 66,
  ESOCKTNOSUPPORT: 137,
  EADDRNOTAVAIL: 4,
  ENETRESET: 39,
  EISCONN: 30,
  ENOTCONN: 53,
  ETOOMANYREFS: 141,
  EUSERS: 136,
  EDQUOT: 19,
  ESTALE: 72,
  ENOTSUP: 138,
  ENOMEDIUM: 148,
  EILSEQ: 25,
  EOVERFLOW: 61,
  ECANCELED: 11,
  ENOTRECOVERABLE: 56,
  EOWNERDEAD: 62,
  ESTRPIPE: 135
};
var NODEFS = {
  isWindows: false,
  staticInit: function() {
    NODEFS.isWindows = !!process.platform.match(/^win/);
    var flags = { fs: fs.constants };
    if (flags["fs"]) {
      flags = flags["fs"];
    }
    NODEFS.flagsForNodeMap = {
      1024: flags["O_APPEND"],
      64: flags["O_CREAT"],
      128: flags["O_EXCL"],
      0: flags["O_RDONLY"],
      2: flags["O_RDWR"],
      4096: flags["O_SYNC"],
      512: flags["O_TRUNC"],
      1: flags["O_WRONLY"]
    };
  },
  bufferFrom: function(arrayBuffer) {
    return Buffer["alloc"] ? Buffer.from(arrayBuffer) : new Buffer(arrayBuffer);
  },
  convertNodeCode: function(e) {
    var code = e.code;
    return ERRNO_CODES[code];
  },
  mount: function(mount) {
    return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0);
  },
  createNode: function(parent, name, mode, dev) {
    if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
      throw new FS.ErrnoError(28);
    }
    var node = FS.createNode(parent, name, mode);
    node.node_ops = NODEFS.node_ops;
    node.stream_ops = NODEFS.stream_ops;
    return node;
  },
  getMode: function(path) {
    var stat;
    try {
      stat = fs.lstatSync(path);
      if (NODEFS.isWindows) {
        stat.mode = stat.mode | ((stat.mode & 292) >> 2);
      }
    } catch (e) {
      if (!e.code) throw e;
      throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
    }
    return stat.mode;
  },
  realPath: function(node) {
    var parts = [];
    while (node.parent !== node) {
      parts.push(node.name);
      node = node.parent;
    }
    parts.push(node.mount.opts.root);
    parts.reverse();
    return PATH.join.apply(null, parts);
  },
  flagsForNode: function(flags) {
    flags &= ~2097152;
    flags &= ~2048;
    flags &= ~32768;
    flags &= ~524288;
    var newFlags = 0;
    for (var k in NODEFS.flagsForNodeMap) {
      if (flags & k) {
        newFlags |= NODEFS.flagsForNodeMap[k];
        flags ^= k;
      }
    }
    if (!flags) {
      return newFlags;
    } else {
      throw new FS.ErrnoError(28);
    }
  },
  node_ops: {
    getattr: function(node) {
      var path = NODEFS.realPath(node);
      var stat;
      try {
        stat = fs.lstatSync(path);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
      if (NODEFS.isWindows && !stat.blksize) {
        stat.blksize = 4096;
      }
      if (NODEFS.isWindows && !stat.blocks) {
        stat.blocks = ((stat.size + stat.blksize - 1) / stat.blksize) | 0;
      }
      return {
        dev: stat.dev,
        ino: stat.ino,
        mode: stat.mode,
        nlink: stat.nlink,
        uid: stat.uid,
        gid: stat.gid,
        rdev: stat.rdev,
        size: stat.size,
        atime: stat.atime,
        mtime: stat.mtime,
        ctime: stat.ctime,
        blksize: stat.blksize,
        blocks: stat.blocks
      };
    },
    setattr: function(node, attr) {
      var path = NODEFS.realPath(node);
      try {
        if (attr.mode !== undefined) {
          fs.chmodSync(path, attr.mode);
          node.mode = attr.mode;
        }
        if (attr.timestamp !== undefined) {
          var date = new Date(attr.timestamp);
          fs.utimesSync(path, date, date);
        }
        if (attr.size !== undefined) {
          fs.truncateSync(path, attr.size);
        }
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    lookup: function(parent, name) {
      var path = PATH.join2(NODEFS.realPath(parent), name);
      var mode = NODEFS.getMode(path);
      return NODEFS.createNode(parent, name, mode);
    },
    mknod: function(parent, name, mode, dev) {
      var node = NODEFS.createNode(parent, name, mode, dev);
      var path = NODEFS.realPath(node);
      try {
        if (FS.isDir(node.mode)) {
          fs.mkdirSync(path, node.mode);
        } else {
          fs.writeFileSync(path, "", { mode: node.mode });
        }
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
      return node;
    },
    rename: function(oldNode, newDir, newName) {
      var oldPath = NODEFS.realPath(oldNode);
      var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
      try {
        fs.renameSync(oldPath, newPath);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
      oldNode.name = newName;
    },
    unlink: function(parent, name) {
      var path = PATH.join2(NODEFS.realPath(parent), name);
      try {
        fs.unlinkSync(path);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    rmdir: function(parent, name) {
      var path = PATH.join2(NODEFS.realPath(parent), name);
      try {
        fs.rmdirSync(path);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    readdir: function(node) {
      var path = NODEFS.realPath(node);
      try {
        return fs.readdirSync(path);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    symlink: function(parent, newName, oldPath) {
      var newPath = PATH.join2(NODEFS.realPath(parent), newName);
      try {
        fs.symlinkSync(oldPath, newPath);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    readlink: function(node) {
      var path = NODEFS.realPath(node);
      try {
        path = fs.readlinkSync(path);
        path = NODEJS_PATH.relative(
          NODEJS_PATH.resolve(node.mount.opts.root),
          path
        );
        return path;
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    }
  },
  stream_ops: {
    open: function(stream) {
      var path = NODEFS.realPath(stream.node);
      try {
        if (FS.isFile(stream.node.mode)) {
          stream.nfd = fs.openSync(path, NODEFS.flagsForNode(stream.flags));
        }
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    close: function(stream) {
      try {
        if (FS.isFile(stream.node.mode) && stream.nfd) {
          fs.closeSync(stream.nfd);
        }
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    read: function(stream, buffer, offset, length, position) {
      if (length === 0) return 0;
      try {
        return fs.readSync(
          stream.nfd,
          NODEFS.bufferFrom(buffer.buffer),
          offset,
          length,
          position
        );
      } catch (e) {
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    write: function(stream, buffer, offset, length, position) {
      try {
        return fs.writeSync(
          stream.nfd,
          NODEFS.bufferFrom(buffer.buffer),
          offset,
          length,
          position
        );
      } catch (e) {
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    llseek: function(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          try {
            var stat = fs.fstatSync(stream.nfd);
            position += stat.size;
          } catch (e) {
            throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
          }
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    mmap: function(stream, address, length, position, prot, flags) {
      assert(address === 0);
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr = _malloc(length);
      NODEFS.stream_ops.read(stream, HEAP8, ptr, length, position);
      return { ptr: ptr, allocated: true };
    },
    msync: function(stream, buffer, offset, length, mmapFlags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      if (mmapFlags & 2) {
        return 0;
      }
      var bytesWritten = NODEFS.stream_ops.write(
        stream,
        buffer,
        0,
        length,
        offset,
        false
      );
      return 0;
    }
  }
};
var NODERAWFS = {
  lookupPath: function(path) {
    return { path: path, node: { mode: NODEFS.getMode(path) } };
  },
  createStandardStreams: function() {
    FS.streams[0] = {
      fd: 0,
      nfd: 0,
      position: 0,
      path: "",
      flags: 0,
      tty: true,
      seekable: false
    };
    for (var i = 1; i < 3; i++) {
      FS.streams[i] = {
        fd: i,
        nfd: i,
        position: 0,
        path: "",
        flags: 577,
        tty: true,
        seekable: false
      };
    }
  },
  cwd: function() {
    return process.cwd();
  },
  chdir: function() {
    process.chdir.apply(void 0, arguments);
  },
  mknod: function(path, mode) {
    if (FS.isDir(path)) {
      fs.mkdirSync(path, mode);
    } else {
      fs.writeFileSync(path, "", { mode: mode });
    }
  },
  mkdir: function() {
    fs.mkdirSync.apply(void 0, arguments);
  },
  symlink: function() {
    fs.symlinkSync.apply(void 0, arguments);
  },
  rename: function() {
    fs.renameSync.apply(void 0, arguments);
  },
  rmdir: function() {
    fs.rmdirSync.apply(void 0, arguments);
  },
  readdir: function() {
    fs.readdirSync.apply(void 0, arguments);
  },
  unlink: function() {
    fs.unlinkSync.apply(void 0, arguments);
  },
  readlink: function() {
    return fs.readlinkSync.apply(void 0, arguments);
  },
  stat: function() {
    return fs.statSync.apply(void 0, arguments);
  },
  lstat: function() {
    return fs.lstatSync.apply(void 0, arguments);
  },
  chmod: function() {
    fs.chmodSync.apply(void 0, arguments);
  },
  fchmod: function() {
    fs.fchmodSync.apply(void 0, arguments);
  },
  chown: function() {
    fs.chownSync.apply(void 0, arguments);
  },
  fchown: function() {
    fs.fchownSync.apply(void 0, arguments);
  },
  truncate: function() {
    fs.truncateSync.apply(void 0, arguments);
  },
  ftruncate: function() {
    fs.ftruncateSync.apply(void 0, arguments);
  },
  utime: function() {
    fs.utimesSync.apply(void 0, arguments);
  },
  open: function(path, flags, mode, suggestFD) {
    if (typeof flags === "string") {
      flags = VFS.modeStringToFlags(flags);
    }
    var nfd = fs.openSync(path, NODEFS.flagsForNode(flags), mode);
    var fd = suggestFD != null ? suggestFD : FS.nextfd(nfd);
    var stream = {
      fd: fd,
      nfd: nfd,
      position: 0,
      path: path,
      flags: flags,
      seekable: true
    };
    FS.streams[fd] = stream;
    return stream;
  },
  close: function(stream) {
    if (!stream.stream_ops) {
      fs.closeSync(stream.nfd);
    }
    FS.closeStream(stream.fd);
  },
  llseek: function(stream, offset, whence) {
    if (stream.stream_ops) {
      return VFS.llseek(stream, offset, whence);
    }
    var position = offset;
    if (whence === 1) {
      position += stream.position;
    } else if (whence === 2) {
      position += fs.fstatSync(stream.nfd).size;
    } else if (whence !== 0) {
      throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
    }
    if (position < 0) {
      throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
    }
    stream.position = position;
    return position;
  },
  read: function(stream, buffer, offset, length, position) {
    if (stream.stream_ops) {
      return VFS.read(stream, buffer, offset, length, position);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking && stream.seekable) position = stream.position;
    var bytesRead = fs.readSync(
      stream.nfd,
      NODEFS.bufferFrom(buffer.buffer),
      offset,
      length,
      position
    );
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write: function(stream, buffer, offset, length, position) {
    if (stream.stream_ops) {
      return VFS.write(stream, buffer, offset, length, position);
    }
    if (stream.flags & +"1024") {
      FS.llseek(stream, 0, +"2");
    }
    var seeking = typeof position !== "undefined";
    if (!seeking && stream.seekable) position = stream.position;
    var bytesWritten = fs.writeSync(
      stream.nfd,
      NODEFS.bufferFrom(buffer.buffer),
      offset,
      length,
      position
    );
    if (!seeking) stream.position += bytesWritten;
    return bytesWritten;
  },
  allocate: function() {
    throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
  },
  mmap: function() {
    throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
  },
  msync: function() {
    return 0;
  },
  munmap: function() {
    return 0;
  },
  ioctl: function() {
    throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
  }
};
var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  trackingDelegate: {},
  tracking: { openFlags: { READ: 1, WRITE: 2 } },
  ErrnoError: null,
  genericErrors: {},
  filesystems: null,
  syncFSRequests: 0,
  handleFSError: function(e) {
    if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
    return setErrNo(e.errno);
  },
  lookupPath: function(path, opts) {
    path = PATH_FS.resolve(FS.cwd(), path);
    opts = opts || {};
    if (!path) return { path: "", node: null };
    var defaults = { follow_mount: true, recurse_count: 0 };
    for (var key in defaults) {
      if (opts[key] === undefined) {
        opts[key] = defaults[key];
      }
    }
    if (opts.recurse_count > 8) {
      throw new FS.ErrnoError(32);
    }
    var parts = PATH.normalizeArray(
      path.split("/").filter(function(p) {
        return !!p;
      }),
      false
    );
    var current = FS.root;
    var current_path = "/";
    for (var i = 0; i < parts.length; i++) {
      var islast = i === parts.length - 1;
      if (islast && opts.parent) {
        break;
      }
      current = FS.lookupNode(current, parts[i]);
      current_path = PATH.join2(current_path, parts[i]);
      if (FS.isMountpoint(current)) {
        if (!islast || (islast && opts.follow_mount)) {
          current = current.mounted.root;
        }
      }
      if (!islast || opts.follow) {
        var count = 0;
        while (FS.isLink(current.mode)) {
          var link = FS.readlink(current_path);
          current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
          var lookup = FS.lookupPath(current_path, {
            recurse_count: opts.recurse_count
          });
          current = lookup.node;
          if (count++ > 40) {
            throw new FS.ErrnoError(32);
          }
        }
      }
    }
    return { path: current_path, node: current };
  },
  getPath: function(node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/"
          ? mount + "/" + path
          : mount + path;
      }
      path = path ? node.name + "/" + path : node.name;
      node = node.parent;
    }
  },
  hashName: function(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode: function(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode: function(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode: function(parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode, parent);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    return FS.lookup(parent, name);
  },
  createNode: function(parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode: function(node) {
    FS.hashRemoveNode(node);
  },
  isRoot: function(node) {
    return node === node.parent;
  },
  isMountpoint: function(node) {
    return !!node.mounted;
  },
  isFile: function(mode) {
    return (mode & 61440) === 32768;
  },
  isDir: function(mode) {
    return (mode & 61440) === 16384;
  },
  isLink: function(mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev: function(mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev: function(mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO: function(mode) {
    return (mode & 61440) === 4096;
  },
  isSocket: function(mode) {
    return (mode & 49152) === 49152;
  },
  flagModes: {
    r: 0,
    rs: 1052672,
    "r+": 2,
    w: 577,
    wx: 705,
    xw: 705,
    "w+": 578,
    "wx+": 706,
    "xw+": 706,
    a: 1089,
    ax: 1217,
    xa: 1217,
    "a+": 1090,
    "ax+": 1218,
    "xa+": 1218
  },
  modeStringToFlags: function(str) {
    var flags = FS.flagModes[str];
    if (typeof flags === "undefined") {
      throw new Error("Unknown file open mode: " + str);
    }
    return flags;
  },
  flagsToPermissionString: function(flag) {
    var perms = ["r", "w", "rw"][flag & 3];
    if (flag & 512) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions: function(node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
      return 2;
    } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
      return 2;
    } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup: function(dir) {
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate: function(dir, name) {
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete: function(dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else {
      if (FS.isDir(node.mode)) {
        return 31;
      }
    }
    return 0;
  },
  mayOpen: function(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    } else if (FS.isDir(node.mode)) {
      if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
        return 31;
      }
    }
    return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
  },
  MAX_OPEN_FDS: 4096,
  nextfd: function(fd_start, fd_end) {
    fd_start = fd_start || 0;
    fd_end = fd_end || FS.MAX_OPEN_FDS;
    for (var fd = fd_start; fd <= fd_end; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStream: function(fd) {
    return FS.streams[fd];
  },
  createStream: function(stream, fd_start, fd_end) {
    if (!FS.FSStream) {
      FS.FSStream = function() {};
      FS.FSStream.prototype = {
        object: {
          get: function() {
            return this.node;
          },
          set: function(val) {
            this.node = val;
          }
        },
        isRead: {
          get: function() {
            return (this.flags & 2097155) !== 1;
          }
        },
        isWrite: {
          get: function() {
            return (this.flags & 2097155) !== 0;
          }
        },
        isAppend: {
          get: function() {
            return this.flags & 1024;
          }
        }
      };
    }
    var newStream = new FS.FSStream();
    for (var p in stream) {
      newStream[p] = stream[p];
    }
    stream = newStream;
    var fd = FS.nextfd(fd_start, fd_end);
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream: function(fd) {
    FS.streams[fd] = null;
  },
  chrdev_stream_ops: {
    open: function(stream) {
      var device = FS.getDevice(stream.node.rdev);
      stream.stream_ops = device.stream_ops;
      if (stream.stream_ops.open) {
        stream.stream_ops.open(stream);
      }
    },
    llseek: function() {
      throw new FS.ErrnoError(70);
    }
  },
  major: function(dev) {
    return dev >> 8;
  },
  minor: function(dev) {
    return dev & 255;
  },
  makedev: function(ma, mi) {
    return (ma << 8) | mi;
  },
  registerDevice: function(dev, ops) {
    FS.devices[dev] = { stream_ops: ops };
  },
  getDevice: function(dev) {
    return FS.devices[dev];
  },
  getMounts: function(mount) {
    var mounts = [];
    var check = [mount];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push.apply(check, m.mounts);
    }
    return mounts;
  },
  syncfs: function(populate, callback) {
    if (typeof populate === "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(
        "warning: " +
          FS.syncFSRequests +
          " FS.syncfs operations in flight at once, probably just doing extra work"
      );
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
    mounts.forEach(function(mount) {
      if (!mount.type.syncfs) {
        return done(null);
      }
      mount.type.syncfs(mount, populate, done);
    });
  },
  mount: function(type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
      mountpoint = lookup.path;
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = { type: type, opts: opts, mountpoint: mountpoint, mounts: [] };
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      node.mounted = mount;
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount: function(mountpoint) {
    var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    Object.keys(FS.nameTable).forEach(function(hash) {
      var current = FS.nameTable[hash];
      while (current) {
        var next = current.name_next;
        if (mounts.indexOf(current.mount) !== -1) {
          FS.destroyNode(current);
        }
        current = next;
      }
    });
    node.mounted = null;
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup: function(parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod: function(path, mode, dev) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name || name === "." || name === "..") {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  create: function(path, mode) {
    mode = mode !== undefined ? mode : 438;
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir: function(path, mode) {
    mode = mode !== undefined ? mode : 511;
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree: function(path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var i = 0; i < dirs.length; ++i) {
      if (!dirs[i]) continue;
      d += "/" + dirs[i];
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev: function(path, mode, dev) {
    if (typeof dev === "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink: function(oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, { parent: true });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  rename: function(old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    var lookup, old_dir, new_dir;
    try {
      lookup = FS.lookupPath(old_path, { parent: true });
      old_dir = lookup.node;
      lookup = FS.lookupPath(new_path, { parent: true });
      new_dir = lookup.node;
    } catch (e) {
      throw new FS.ErrnoError(10);
    }
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    var old_node = FS.lookupNode(old_dir, old_name);
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    if (old_node === new_node) {
      return;
    }
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    errCode = new_node
      ? FS.mayDelete(new_dir, new_name, isdir)
      : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    try {
      if (FS.trackingDelegate["willMovePath"]) {
        FS.trackingDelegate["willMovePath"](old_path, new_path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willMovePath']('" +
          old_path +
          "', '" +
          new_path +
          "') threw an exception: " +
          e.message
      );
    }
    FS.hashRemoveNode(old_node);
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
    } catch (e) {
      throw e;
    } finally {
      FS.hashAddNode(old_node);
    }
    try {
      if (FS.trackingDelegate["onMovePath"])
        FS.trackingDelegate["onMovePath"](old_path, new_path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onMovePath']('" +
          old_path +
          "', '" +
          new_path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  rmdir: function(path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    try {
      if (FS.trackingDelegate["willDeletePath"]) {
        FS.trackingDelegate["willDeletePath"](path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
    try {
      if (FS.trackingDelegate["onDeletePath"])
        FS.trackingDelegate["onDeletePath"](path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  readdir: function(path) {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    if (!node.node_ops.readdir) {
      throw new FS.ErrnoError(54);
    }
    return node.node_ops.readdir(node);
  },
  unlink: function(path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    try {
      if (FS.trackingDelegate["willDeletePath"]) {
        FS.trackingDelegate["willDeletePath"](path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
    try {
      if (FS.trackingDelegate["onDeletePath"])
        FS.trackingDelegate["onDeletePath"](path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  readlink: function(path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return PATH_FS.resolve(
      FS.getPath(link.parent),
      link.node_ops.readlink(link)
    );
  },
  stat: function(path, dontFollow) {
    var lookup = FS.lookupPath(path, { follow: !dontFollow });
    var node = lookup.node;
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (!node.node_ops.getattr) {
      throw new FS.ErrnoError(63);
    }
    return node.node_ops.getattr(node);
  },
  lstat: function(path) {
    return FS.stat(path, true);
  },
  chmod: function(path, mode, dontFollow) {
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      timestamp: Date.now()
    });
  },
  lchmod: function(path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod: function(fd, mode) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    FS.chmod(stream.node, mode);
  },
  chown: function(path, uid, gid, dontFollow) {
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, { timestamp: Date.now() });
  },
  lchown: function(path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown: function(fd, uid, gid) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    FS.chown(stream.node, uid, gid);
  },
  truncate: function(path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: true });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
  },
  ftruncate: function(fd, len) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.truncate(stream.node, len);
  },
  utime: function(path, atime, mtime) {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
  },
  open: function(path, flags, mode, fd_start, fd_end) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
    mode = typeof mode === "undefined" ? 438 : mode;
    if (flags & 64) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    if (typeof path === "object") {
      node = path;
    } else {
      path = PATH.normalize(path);
      try {
        var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
        node = lookup.node;
      } catch (e) {}
    }
    var created = false;
    if (flags & 64) {
      if (node) {
        if (flags & 128) {
          throw new FS.ErrnoError(20);
        }
      } else {
        node = FS.mknod(path, mode, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    if (flags & 65536 && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    if (flags & 512) {
      FS.truncate(node, 0);
    }
    flags &= ~(128 | 512 | 131072);
    var stream = FS.createStream(
      {
        node: node,
        path: FS.getPath(node),
        flags: flags,
        seekable: true,
        position: 0,
        stream_ops: node.stream_ops,
        ungotten: [],
        error: false
      },
      fd_start,
      fd_end
    );
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (Module["logReadFiles"] && !(flags & 1)) {
      if (!FS.readFiles) FS.readFiles = {};
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1;
        err("FS.trackingDelegate error on read file: " + path);
      }
    }
    try {
      if (FS.trackingDelegate["onOpenFile"]) {
        var trackingFlags = 0;
        if ((flags & 2097155) !== 1) {
          trackingFlags |= FS.tracking.openFlags.READ;
        }
        if ((flags & 2097155) !== 0) {
          trackingFlags |= FS.tracking.openFlags.WRITE;
        }
        FS.trackingDelegate["onOpenFile"](path, trackingFlags);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['onOpenFile']('" +
          path +
          "', flags) threw an exception: " +
          e.message
      );
    }
    return stream;
  },
  close: function(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed: function(stream) {
    return stream.fd === null;
  },
  llseek: function(stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read: function(stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(
      stream,
      buffer,
      offset,
      length,
      position
    );
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write: function(stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(
      stream,
      buffer,
      offset,
      length,
      position,
      canOwn
    );
    if (!seeking) stream.position += bytesWritten;
    try {
      if (stream.path && FS.trackingDelegate["onWriteToFile"])
        FS.trackingDelegate["onWriteToFile"](stream.path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onWriteToFile']('" +
          stream.path +
          "') threw an exception: " +
          e.message
      );
    }
    return bytesWritten;
  },
  allocate: function(stream, offset, length) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (offset < 0 || length <= 0) {
      throw new FS.ErrnoError(28);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (!stream.stream_ops.allocate) {
      throw new FS.ErrnoError(138);
    }
    stream.stream_ops.allocate(stream, offset, length);
  },
  mmap: function(stream, address, length, position, prot, flags) {
    if (
      (prot & 2) !== 0 &&
      (flags & 2) === 0 &&
      (stream.flags & 2097155) !== 2
    ) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    return stream.stream_ops.mmap(
      stream,
      address,
      length,
      position,
      prot,
      flags
    );
  },
  msync: function(stream, buffer, offset, length, mmapFlags) {
    if (!stream || !stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  munmap: function(stream) {
    return 0;
  },
  ioctl: function(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile: function(path, opts) {
    opts = opts || {};
    opts.flags = opts.flags || "r";
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      throw new Error('Invalid encoding type "' + opts.encoding + '"');
    }
    var ret;
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      ret = UTF8ArrayToString(buf, 0);
    } else if (opts.encoding === "binary") {
      ret = buf;
    }
    FS.close(stream);
    return ret;
  },
  writeFile: function(path, data, opts) {
    opts = opts || {};
    opts.flags = opts.flags || "w";
    var stream = FS.open(path, opts.flags, opts.mode);
    if (typeof data === "string") {
      var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
      var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
      FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
    } else if (ArrayBuffer.isView(data)) {
      FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    } else {
      throw new Error("Unsupported data type");
    }
    FS.close(stream);
  },
  cwd: function() {
    return FS.currentPath;
  },
  chdir: function(path) {
    var lookup = FS.lookupPath(path, { follow: true });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories: function() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices: function() {
    FS.mkdir("/dev");
    FS.registerDevice(FS.makedev(1, 3), {
      read: function() {
        return 0;
      },
      write: function(stream, buffer, offset, length, pos) {
        return length;
      }
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    var random_device;
    if (
      typeof crypto === "object" &&
      typeof crypto["getRandomValues"] === "function"
    ) {
      var randomBuffer = new Uint8Array(1);
      random_device = function() {
        crypto.getRandomValues(randomBuffer);
        return randomBuffer[0];
      };
    } else if (ENVIRONMENT_IS_NODE) {
      try {
        var crypto_module = __webpack_require__(417);
        random_device = function() {
          return crypto_module["randomBytes"](1)[0];
        };
      } catch (e) {}
    } else {
    }
    if (!random_device) {
      random_device = function() {
        abort("random_device");
      };
    }
    FS.createDevice("/dev", "random", random_device);
    FS.createDevice("/dev", "urandom", random_device);
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories: function() {
    FS.mkdir("/proc");
    FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount(
      {
        mount: function() {
          var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
          node.node_ops = {
            lookup: function(parent, name) {
              var fd = +name;
              var stream = FS.getStream(fd);
              if (!stream) throw new FS.ErrnoError(8);
              var ret = {
                parent: null,
                mount: { mountpoint: "fake" },
                node_ops: {
                  readlink: function() {
                    return stream.path;
                  }
                }
              };
              ret.parent = ret;
              return ret;
            }
          };
          return node;
        }
      },
      {},
      "/proc/self/fd"
    );
  },
  createStandardStreams: function() {
    if (Module["stdin"]) {
      FS.createDevice("/dev", "stdin", Module["stdin"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (Module["stdout"]) {
      FS.createDevice("/dev", "stdout", null, Module["stdout"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (Module["stderr"]) {
      FS.createDevice("/dev", "stderr", null, Module["stderr"]);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    var stdin = FS.open("/dev/stdin", "r");
    var stdout = FS.open("/dev/stdout", "w");
    var stderr = FS.open("/dev/stderr", "w");
  },
  ensureErrnoError: function() {
    if (FS.ErrnoError) return;
    FS.ErrnoError = function ErrnoError(errno, node) {
      this.node = node;
      this.setErrno = function(errno) {
        this.errno = errno;
      };
      this.setErrno(errno);
      this.message = "FS error";
    };
    FS.ErrnoError.prototype = new Error();
    FS.ErrnoError.prototype.constructor = FS.ErrnoError;
    [44].forEach(function(code) {
      FS.genericErrors[code] = new FS.ErrnoError(code);
      FS.genericErrors[code].stack = "<generic error, no stack>";
    });
  },
  staticInit: function() {
    FS.ensureErrnoError();
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = { MEMFS: MEMFS, NODEFS: NODEFS };
  },
  init: function(input, output, error) {
    FS.init.initialized = true;
    FS.ensureErrnoError();
    Module["stdin"] = input || Module["stdin"];
    Module["stdout"] = output || Module["stdout"];
    Module["stderr"] = error || Module["stderr"];
    FS.createStandardStreams();
  },
  quit: function() {
    FS.init.initialized = false;
    var fflush = Module["_fflush"];
    if (fflush) fflush(0);
    for (var i = 0; i < FS.streams.length; i++) {
      var stream = FS.streams[i];
      if (!stream) {
        continue;
      }
      FS.close(stream);
    }
  },
  getMode: function(canRead, canWrite) {
    var mode = 0;
    if (canRead) mode |= 292 | 73;
    if (canWrite) mode |= 146;
    return mode;
  },
  joinPath: function(parts, forceRelative) {
    var path = PATH.join.apply(null, parts);
    if (forceRelative && path[0] == "/") path = path.substr(1);
    return path;
  },
  absolutePath: function(relative, base) {
    return PATH_FS.resolve(base, relative);
  },
  standardizePath: function(path) {
    return PATH.normalize(path);
  },
  findObject: function(path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (ret.exists) {
      return ret.object;
    } else {
      setErrNo(ret.error);
      return null;
    }
  },
  analyzePath: function(path, dontResolveLastLink) {
    try {
      var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    try {
      var lookup = FS.lookupPath(path, { parent: true });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createFolder: function(parent, name, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(canRead, canWrite);
    return FS.mkdir(path, mode);
  },
  createPath: function(parent, path, canRead, canWrite) {
    parent = typeof parent === "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {}
      parent = current;
    }
    return current;
  },
  createFile: function(parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
    var path = name
      ? PATH.join2(
          typeof parent === "string" ? parent : FS.getPath(parent),
          name
        )
      : parent;
    var mode = FS.getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      if (typeof data === "string") {
        var arr = new Array(data.length);
        for (var i = 0, len = data.length; i < len; ++i)
          arr[i] = data.charCodeAt(i);
        data = arr;
      }
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, "w");
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
    return node;
  },
  createDevice: function(parent, name, input, output) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(!!input, !!output);
    if (!FS.createDevice.major) FS.createDevice.major = 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    FS.registerDevice(dev, {
      open: function(stream) {
        stream.seekable = false;
      },
      close: function(stream) {
        if (output && output.buffer && output.buffer.length) {
          output(10);
        }
      },
      read: function(stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.timestamp = Date.now();
        }
        return bytesRead;
      },
      write: function(stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.timestamp = Date.now();
        }
        return i;
      }
    });
    return FS.mkdev(path, mode, dev);
  },
  createLink: function(parent, name, target, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    return FS.symlink(target, path);
  },
  forceLoadFile: function(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    var success = true;
    if (typeof XMLHttpRequest !== "undefined") {
      throw new Error(
        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
      );
    } else if (read_) {
      try {
        obj.contents = intArrayFromString(read_(obj.url), true);
        obj.usedBytes = obj.contents.length;
      } catch (e) {
        success = false;
      }
    } else {
      throw new Error("Cannot load without read() or XMLHttpRequest.");
    }
    if (!success) setErrNo(29);
    return success;
  },
  createLazyFile: function(parent, name, url, canRead, canWrite) {
    function LazyUint8Array() {
      this.lengthKnown = false;
      this.chunks = [];
    }
    LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
      if (idx > this.length - 1 || idx < 0) {
        return undefined;
      }
      var chunkOffset = idx % this.chunkSize;
      var chunkNum = (idx / this.chunkSize) | 0;
      return this.getter(chunkNum)[chunkOffset];
    };
    LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(
      getter
    ) {
      this.getter = getter;
    };
    LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
      var xhr = new XMLHttpRequest();
      xhr.open("HEAD", url, false);
      xhr.send(null);
      if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
        throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
      var datalength = Number(xhr.getResponseHeader("Content-length"));
      var header;
      var hasByteServing =
        (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
      var usesGzip =
        (header = xhr.getResponseHeader("Content-Encoding")) &&
        header === "gzip";
      var chunkSize = 1024 * 1024;
      if (!hasByteServing) chunkSize = datalength;
      var doXHR = function(from, to) {
        if (from > to)
          throw new Error(
            "invalid range (" + from + ", " + to + ") or no bytes requested!"
          );
        if (to > datalength - 1)
          throw new Error(
            "only " + datalength + " bytes available! programmer error!"
          );
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        if (datalength !== chunkSize)
          xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
        if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
        if (xhr.overrideMimeType) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
        xhr.send(null);
        if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
          throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
        if (xhr.response !== undefined) {
          return new Uint8Array(xhr.response || []);
        } else {
          return intArrayFromString(xhr.responseText || "", true);
        }
      };
      var lazyArray = this;
      lazyArray.setDataGetter(function(chunkNum) {
        var start = chunkNum * chunkSize;
        var end = (chunkNum + 1) * chunkSize - 1;
        end = Math.min(end, datalength - 1);
        if (typeof lazyArray.chunks[chunkNum] === "undefined") {
          lazyArray.chunks[chunkNum] = doXHR(start, end);
        }
        if (typeof lazyArray.chunks[chunkNum] === "undefined")
          throw new Error("doXHR failed!");
        return lazyArray.chunks[chunkNum];
      });
      if (usesGzip || !datalength) {
        chunkSize = datalength = 1;
        datalength = this.getter(0).length;
        chunkSize = datalength;
        out(
          "LazyFiles on gzip forces download of the whole file when length is accessed"
        );
      }
      this._length = datalength;
      this._chunkSize = chunkSize;
      this.lengthKnown = true;
    };
    if (typeof XMLHttpRequest !== "undefined") {
      if (!ENVIRONMENT_IS_WORKER)
        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
      var lazyArray = new LazyUint8Array();
      Object.defineProperties(lazyArray, {
        length: {
          get: function() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          }
        },
        chunkSize: {
          get: function() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          }
        }
      });
      var properties = { isDevice: false, contents: lazyArray };
    } else {
      var properties = { isDevice: false, url: url };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents.length;
        }
      }
    });
    var stream_ops = {};
    var keys = Object.keys(node.stream_ops);
    keys.forEach(function(key) {
      var fn = node.stream_ops[key];
      stream_ops[key] = function forceLoadLazyFile() {
        if (!FS.forceLoadFile(node)) {
          throw new FS.ErrnoError(29);
        }
        return fn.apply(null, arguments);
      };
    });
    stream_ops.read = function stream_ops_read(
      stream,
      buffer,
      offset,
      length,
      position
    ) {
      if (!FS.forceLoadFile(node)) {
        throw new FS.ErrnoError(29);
      }
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    };
    node.stream_ops = stream_ops;
    return node;
  },
  createPreloadedFile: function(
    parent,
    name,
    url,
    canRead,
    canWrite,
    onload,
    onerror,
    dontCreateFile,
    canOwn,
    preFinish
  ) {
    Browser.init();
    var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
    var dep = getUniqueRunDependency("cp " + fullname);
    function processData(byteArray) {
      function finish(byteArray) {
        if (preFinish) preFinish();
        if (!dontCreateFile) {
          FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
        }
        if (onload) onload();
        removeRunDependency(dep);
      }
      var handled = false;
      Module["preloadPlugins"].forEach(function(plugin) {
        if (handled) return;
        if (plugin["canHandle"](fullname)) {
          plugin["handle"](byteArray, fullname, finish, function() {
            if (onerror) onerror();
            removeRunDependency(dep);
          });
          handled = true;
        }
      });
      if (!handled) finish(byteArray);
    }
    addRunDependency(dep);
    if (typeof url == "string") {
      Browser.asyncLoad(
        url,
        function(byteArray) {
          processData(byteArray);
        },
        onerror
      );
    } else {
      processData(url);
    }
  },
  indexedDB: function() {
    return (
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB
    );
  },
  DB_NAME: function() {
    return "EM_FS_" + window.location.pathname;
  },
  DB_VERSION: 20,
  DB_STORE_NAME: "FILE_DATA",
  saveFilesToDB: function(paths, onload, onerror) {
    onload = onload || function() {};
    onerror = onerror || function() {};
    var indexedDB = FS.indexedDB();
    try {
      var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return onerror(e);
    }
    openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
      out("creating db");
      var db = openRequest.result;
      db.createObjectStore(FS.DB_STORE_NAME);
    };
    openRequest.onsuccess = function openRequest_onsuccess() {
      var db = openRequest.result;
      var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
      var files = transaction.objectStore(FS.DB_STORE_NAME);
      var ok = 0,
        fail = 0,
        total = paths.length;
      function finish() {
        if (fail == 0) onload();
        else onerror();
      }
      paths.forEach(function(path) {
        var putRequest = files.put(FS.analyzePath(path).object.contents, path);
        putRequest.onsuccess = function putRequest_onsuccess() {
          ok++;
          if (ok + fail == total) finish();
        };
        putRequest.onerror = function putRequest_onerror() {
          fail++;
          if (ok + fail == total) finish();
        };
      });
      transaction.onerror = onerror;
    };
    openRequest.onerror = onerror;
  },
  loadFilesFromDB: function(paths, onload, onerror) {
    onload = onload || function() {};
    onerror = onerror || function() {};
    var indexedDB = FS.indexedDB();
    try {
      var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return onerror(e);
    }
    openRequest.onupgradeneeded = onerror;
    openRequest.onsuccess = function openRequest_onsuccess() {
      var db = openRequest.result;
      try {
        var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
      } catch (e) {
        onerror(e);
        return;
      }
      var files = transaction.objectStore(FS.DB_STORE_NAME);
      var ok = 0,
        fail = 0,
        total = paths.length;
      function finish() {
        if (fail == 0) onload();
        else onerror();
      }
      paths.forEach(function(path) {
        var getRequest = files.get(path);
        getRequest.onsuccess = function getRequest_onsuccess() {
          if (FS.analyzePath(path).exists) {
            FS.unlink(path);
          }
          FS.createDataFile(
            PATH.dirname(path),
            PATH.basename(path),
            getRequest.result,
            true,
            true,
            true
          );
          ok++;
          if (ok + fail == total) finish();
        };
        getRequest.onerror = function getRequest_onerror() {
          fail++;
          if (ok + fail == total) finish();
        };
      });
      transaction.onerror = onerror;
    };
    openRequest.onerror = onerror;
  }
};
var SYSCALLS = {
  mappings: {},
  DEFAULT_POLLMASK: 5,
  umask: 511,
  calculateAt: function(dirfd, path) {
    if (path[0] !== "/") {
      var dir;
      if (dirfd === -100) {
        dir = FS.cwd();
      } else {
        var dirstream = FS.getStream(dirfd);
        if (!dirstream) throw new FS.ErrnoError(8);
        dir = dirstream.path;
      }
      path = PATH.join2(dir, path);
    }
    return path;
  },
  doStat: function(func, path, buf) {
    try {
      var stat = func(path);
    } catch (e) {
      if (
        e &&
        e.node &&
        PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
      ) {
        return -54;
      }
      throw e;
    }
    HEAP32[buf >> 2] = stat.dev;
    HEAP32[(buf + 4) >> 2] = 0;
    HEAP32[(buf + 8) >> 2] = stat.ino;
    HEAP32[(buf + 12) >> 2] = stat.mode;
    HEAP32[(buf + 16) >> 2] = stat.nlink;
    HEAP32[(buf + 20) >> 2] = stat.uid;
    HEAP32[(buf + 24) >> 2] = stat.gid;
    HEAP32[(buf + 28) >> 2] = stat.rdev;
    HEAP32[(buf + 32) >> 2] = 0;
    (tempI64 = [
      stat.size >>> 0,
      ((tempDouble = stat.size),
      +Math_abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0)
    ]),
      (HEAP32[(buf + 40) >> 2] = tempI64[0]),
      (HEAP32[(buf + 44) >> 2] = tempI64[1]);
    HEAP32[(buf + 48) >> 2] = 4096;
    HEAP32[(buf + 52) >> 2] = stat.blocks;
    HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0;
    HEAP32[(buf + 60) >> 2] = 0;
    HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0;
    HEAP32[(buf + 68) >> 2] = 0;
    HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0;
    HEAP32[(buf + 76) >> 2] = 0;
    (tempI64 = [
      stat.ino >>> 0,
      ((tempDouble = stat.ino),
      +Math_abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0)
    ]),
      (HEAP32[(buf + 80) >> 2] = tempI64[0]),
      (HEAP32[(buf + 84) >> 2] = tempI64[1]);
    return 0;
  },
  doMsync: function(addr, stream, len, flags, offset) {
    var buffer = HEAPU8.slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  doMkdir: function(path, mode) {
    path = PATH.normalize(path);
    if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
    FS.mkdir(path, mode, 0);
    return 0;
  },
  doMknod: function(path, mode, dev) {
    switch (mode & 61440) {
      case 32768:
      case 8192:
      case 24576:
      case 4096:
      case 49152:
        break;
      default:
        return -28;
    }
    FS.mknod(path, mode, dev);
    return 0;
  },
  doReadlink: function(path, buf, bufsize) {
    if (bufsize <= 0) return -28;
    var ret = FS.readlink(path);
    var len = Math.min(bufsize, lengthBytesUTF8(ret));
    var endChar = HEAP8[buf + len];
    stringToUTF8(ret, buf, bufsize + 1);
    HEAP8[buf + len] = endChar;
    return len;
  },
  doAccess: function(path, amode) {
    if (amode & ~7) {
      return -28;
    }
    var node;
    var lookup = FS.lookupPath(path, { follow: true });
    node = lookup.node;
    if (!node) {
      return -44;
    }
    var perms = "";
    if (amode & 4) perms += "r";
    if (amode & 2) perms += "w";
    if (amode & 1) perms += "x";
    if (perms && FS.nodePermissions(node, perms)) {
      return -2;
    }
    return 0;
  },
  doDup: function(path, flags, suggestFD) {
    var suggest = FS.getStream(suggestFD);
    if (suggest) FS.close(suggest);
    return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
  },
  doReadv: function(stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAP32[(iov + i * 8) >> 2];
      var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
      var curr = FS.read(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
      if (curr < len) break;
    }
    return ret;
  },
  doWritev: function(stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAP32[(iov + i * 8) >> 2];
      var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
      var curr = FS.write(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
    }
    return ret;
  },
  varargs: undefined,
  get: function() {
    SYSCALLS.varargs += 4;
    var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
    return ret;
  },
  getStr: function(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  },
  getStreamFromFD: function(fd) {
    var stream = FS.getStream(fd);
    if (!stream) throw new FS.ErrnoError(8);
    return stream;
  },
  get64: function(low, high) {
    return low;
  }
};
function ___sys_chmod(path, mode) {
  try {
    path = SYSCALLS.getStr(path);
    FS.chmod(path, mode);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
      case 0: {
        var arg = SYSCALLS.get();
        if (arg < 0) {
          return -28;
        }
        var newStream;
        newStream = FS.open(stream.path, stream.flags, 0, arg);
        return newStream.fd;
      }
      case 1:
      case 2:
        return 0;
      case 3:
        return stream.flags;
      case 4: {
        var arg = SYSCALLS.get();
        stream.flags |= arg;
        return 0;
      }
      case 12: {
        var arg = SYSCALLS.get();
        var offset = 0;
        HEAP16[(arg + offset) >> 1] = 2;
        return 0;
      }
      case 13:
      case 14:
        return 0;
      case 16:
      case 8:
        return -28;
      case 9:
        setErrNo(28);
        return -1;
      default: {
        return -28;
      }
    }
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fstat64(fd, buf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return SYSCALLS.doStat(FS.stat, stream.path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_ioctl(fd, op, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (op) {
      case 21509:
      case 21505: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21510:
      case 21511:
      case 21512:
      case 21506:
      case 21507:
      case 21508: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21519: {
        if (!stream.tty) return -59;
        var argp = SYSCALLS.get();
        HEAP32[argp >> 2] = 0;
        return 0;
      }
      case 21520: {
        if (!stream.tty) return -59;
        return -28;
      }
      case 21531: {
        var argp = SYSCALLS.get();
        return FS.ioctl(stream, op, argp);
      }
      case 21523: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21524: {
        if (!stream.tty) return -59;
        return 0;
      }
      default:
        abort("bad ioctl syscall " + op);
    }
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_open(path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var pathname = SYSCALLS.getStr(path);
    var mode = SYSCALLS.get();
    var stream = FS.open(pathname, flags, mode);
    return stream.fd;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_read(fd, buf, count) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return FS.read(stream, HEAP8, buf, count);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_rename(old_path, new_path) {
  try {
    old_path = SYSCALLS.getStr(old_path);
    new_path = SYSCALLS.getStr(new_path);
    FS.rename(old_path, new_path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_rmdir(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_stat64(path, buf) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doStat(FS.stat, path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_unlink(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.unlink(path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function _emscripten_memcpy_big(dest, src, num) {
  HEAPU8.copyWithin(dest, src, src + num);
}
function _emscripten_get_heap_size() {
  return HEAPU8.length;
}
function emscripten_realloc_buffer(size) {
  try {
    wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
    updateGlobalBufferAndViews(wasmMemory.buffer);
    return 1;
  } catch (e) {}
}
function _emscripten_resize_heap(requestedSize) {
  requestedSize = requestedSize >>> 0;
  var oldSize = _emscripten_get_heap_size();
  var PAGE_MULTIPLE = 65536;
  var maxHeapSize = 2147483648;
  if (requestedSize > maxHeapSize) {
    return false;
  }
  var minHeapSize = 16777216;
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(
      maxHeapSize,
      alignUp(
        Math.max(minHeapSize, requestedSize, overGrownHeapSize),
        PAGE_MULTIPLE
      )
    );
    var replacement = emscripten_realloc_buffer(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
}
function _fd_close(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_fdstat_get(fd, pbuf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var type = stream.tty
      ? 2
      : FS.isDir(stream.mode)
      ? 3
      : FS.isLink(stream.mode)
      ? 7
      : 4;
    HEAP8[pbuf >> 0] = type;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_read(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = SYSCALLS.doReadv(stream, iov, iovcnt);
    HEAP32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var HIGH_OFFSET = 4294967296;
    var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
    var DOUBLE_LIMIT = 9007199254740992;
    if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
      return -61;
    }
    FS.llseek(stream, offset, whence);
    (tempI64 = [
      stream.position >>> 0,
      ((tempDouble = stream.position),
      +Math_abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0)
    ]),
      (HEAP32[newOffset >> 2] = tempI64[0]),
      (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_write(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = SYSCALLS.doWritev(stream, iov, iovcnt);
    HEAP32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
var ___tm_current = 20656;
var ___tm_timezone = (stringToUTF8("GMT", 20704, 4), 20704);
function _gmtime_r(time, tmPtr) {
  var date = new Date(HEAP32[time >> 2] * 1e3);
  HEAP32[tmPtr >> 2] = date.getUTCSeconds();
  HEAP32[(tmPtr + 4) >> 2] = date.getUTCMinutes();
  HEAP32[(tmPtr + 8) >> 2] = date.getUTCHours();
  HEAP32[(tmPtr + 12) >> 2] = date.getUTCDate();
  HEAP32[(tmPtr + 16) >> 2] = date.getUTCMonth();
  HEAP32[(tmPtr + 20) >> 2] = date.getUTCFullYear() - 1900;
  HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
  HEAP32[(tmPtr + 36) >> 2] = 0;
  HEAP32[(tmPtr + 32) >> 2] = 0;
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  HEAP32[(tmPtr + 40) >> 2] = ___tm_timezone;
  return tmPtr;
}
function _gmtime(time) {
  return _gmtime_r(time, ___tm_current);
}
function _setTempRet0($i) {
  setTempRet0($i | 0);
}
function _time(ptr) {
  var ret = (Date.now() / 1e3) | 0;
  if (ptr) {
    HEAP32[ptr >> 2] = ret;
  }
  return ret;
}
function _tzset() {
  if (_tzset.called) return;
  _tzset.called = true;
  HEAP32[__get_timezone() >> 2] = new Date().getTimezoneOffset() * 60;
  var currentYear = new Date().getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  HEAP32[__get_daylight() >> 2] = Number(
    winter.getTimezoneOffset() != summer.getTimezoneOffset()
  );
  function extractZone(date) {
    var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
    return match ? match[1] : "GMT";
  }
  var winterName = extractZone(winter);
  var summerName = extractZone(summer);
  var winterNamePtr = allocateUTF8(winterName);
  var summerNamePtr = allocateUTF8(summerName);
  if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
    HEAP32[__get_tzname() >> 2] = winterNamePtr;
    HEAP32[(__get_tzname() + 4) >> 2] = summerNamePtr;
  } else {
    HEAP32[__get_tzname() >> 2] = summerNamePtr;
    HEAP32[(__get_tzname() + 4) >> 2] = winterNamePtr;
  }
}
function _timegm(tmPtr) {
  _tzset();
  var time = Date.UTC(
    HEAP32[(tmPtr + 20) >> 2] + 1900,
    HEAP32[(tmPtr + 16) >> 2],
    HEAP32[(tmPtr + 12) >> 2],
    HEAP32[(tmPtr + 8) >> 2],
    HEAP32[(tmPtr + 4) >> 2],
    HEAP32[tmPtr >> 2],
    0
  );
  var date = new Date(time);
  HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  return (date.getTime() / 1e3) | 0;
}
var FSNode = function(parent, name, mode, rdev) {
  if (!parent) {
    parent = this;
  }
  this.parent = parent;
  this.mount = parent.mount;
  this.mounted = null;
  this.id = FS.nextInode++;
  this.name = name;
  this.mode = mode;
  this.node_ops = {};
  this.stream_ops = {};
  this.rdev = rdev;
};
var readMode = 292 | 73;
var writeMode = 146;
Object.defineProperties(FSNode.prototype, {
  read: {
    get: function() {
      return (this.mode & readMode) === readMode;
    },
    set: function(val) {
      val ? (this.mode |= readMode) : (this.mode &= ~readMode);
    }
  },
  write: {
    get: function() {
      return (this.mode & writeMode) === writeMode;
    },
    set: function(val) {
      val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
    }
  },
  isFolder: {
    get: function() {
      return FS.isDir(this.mode);
    }
  },
  isDevice: {
    get: function() {
      return FS.isChrdev(this.mode);
    }
  }
});
FS.FSNode = FSNode;
FS.staticInit();
if (ENVIRONMENT_IS_NODE) {
  var fs = frozenFs;
  var NODEJS_PATH = __webpack_require__(622);
  NODEFS.staticInit();
}
if (ENVIRONMENT_IS_NODE) {
  var _wrapNodeError = function(func) {
    return function() {
      try {
        return func.apply(this, arguments);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code]);
      }
    };
  };
  var VFS = Object.assign({}, FS);
  for (var _key in NODERAWFS) FS[_key] = _wrapNodeError(NODERAWFS[_key]);
} else {
  throw new Error(
    "NODERAWFS is currently only supported on Node.js environment."
  );
}
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}
var decodeBase64 =
  typeof atob === "function"
    ? atob
    : function(input) {
        var keyStr =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
          }
        } while (i < input.length);
        return output;
      };
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) {
    var buf;
    try {
      buf = Buffer.from(s, "base64");
    } catch (_) {
      buf = new Buffer(s, "base64");
    }
    return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"]);
  }
  try {
    var decoded = decodeBase64(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0; i < decoded.length; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error("Converting base64 string to bytes failed.");
  }
}
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }
  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}
var asmLibraryArg = {
  p: ___sys_chmod,
  e: ___sys_fcntl64,
  j: ___sys_fstat64,
  o: ___sys_ioctl,
  r: ___sys_open,
  q: ___sys_read,
  h: ___sys_rename,
  s: ___sys_rmdir,
  c: ___sys_stat64,
  g: ___sys_unlink,
  t: _emscripten_memcpy_big,
  u: _emscripten_resize_heap,
  f: _fd_close,
  i: _fd_fdstat_get,
  n: _fd_read,
  l: _fd_seek,
  d: _fd_write,
  k: _gmtime,
  memory: wasmMemory,
  a: _setTempRet0,
  table: wasmTable,
  b: _time,
  m: _timegm
};
var asm = createWasm();
var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = asm["v"]);
var _zipstruct_stat = (Module["_zipstruct_stat"] = asm["w"]);
var _zipstruct_statS = (Module["_zipstruct_statS"] = asm["x"]);
var _zipstruct_stat_name = (Module["_zipstruct_stat_name"] = asm["y"]);
var _zipstruct_stat_index = (Module["_zipstruct_stat_index"] = asm["z"]);
var _zipstruct_stat_size = (Module["_zipstruct_stat_size"] = asm["A"]);
var _zipstruct_stat_mtime = (Module["_zipstruct_stat_mtime"] = asm["B"]);
var _zipstruct_error = (Module["_zipstruct_error"] = asm["C"]);
var _zipstruct_errorS = (Module["_zipstruct_errorS"] = asm["D"]);
var _zip_close = (Module["_zip_close"] = asm["E"]);
var _zip_dir_add = (Module["_zip_dir_add"] = asm["F"]);
var _zip_discard = (Module["_zip_discard"] = asm["G"]);
var _zip_error_init_with_code = (Module["_zip_error_init_with_code"] =
  asm["H"]);
var _zip_get_error = (Module["_zip_get_error"] = asm["I"]);
var _zip_file_get_error = (Module["_zip_file_get_error"] = asm["J"]);
var _zip_error_strerror = (Module["_zip_error_strerror"] = asm["K"]);
var _zip_fclose = (Module["_zip_fclose"] = asm["L"]);
var _zip_file_add = (Module["_zip_file_add"] = asm["M"]);
var _zip_file_get_external_attributes = (Module[
  "_zip_file_get_external_attributes"
] = asm["N"]);
var _zip_file_set_external_attributes = (Module[
  "_zip_file_set_external_attributes"
] = asm["O"]);
var _zip_file_set_mtime = (Module["_zip_file_set_mtime"] = asm["P"]);
var _zip_fopen = (Module["_zip_fopen"] = asm["Q"]);
var _zip_fopen_index = (Module["_zip_fopen_index"] = asm["R"]);
var _zip_fread = (Module["_zip_fread"] = asm["S"]);
var _zip_get_name = (Module["_zip_get_name"] = asm["T"]);
var _zip_get_num_entries = (Module["_zip_get_num_entries"] = asm["U"]);
var _zip_name_locate = (Module["_zip_name_locate"] = asm["V"]);
var _zip_open = (Module["_zip_open"] = asm["W"]);
var _zip_open_from_source = (Module["_zip_open_from_source"] = asm["X"]);
var _zip_set_file_compression = (Module["_zip_set_file_compression"] =
  asm["Y"]);
var _zip_source_buffer = (Module["_zip_source_buffer"] = asm["Z"]);
var _zip_source_buffer_create = (Module["_zip_source_buffer_create"] =
  asm["_"]);
var _zip_source_close = (Module["_zip_source_close"] = asm["$"]);
var _zip_source_error = (Module["_zip_source_error"] = asm["aa"]);
var _zip_source_free = (Module["_zip_source_free"] = asm["ba"]);
var _zip_source_keep = (Module["_zip_source_keep"] = asm["ca"]);
var _zip_source_open = (Module["_zip_source_open"] = asm["da"]);
var _zip_source_read = (Module["_zip_source_read"] = asm["ea"]);
var _zip_source_seek = (Module["_zip_source_seek"] = asm["fa"]);
var _zip_source_set_mtime = (Module["_zip_source_set_mtime"] = asm["ga"]);
var _zip_source_tell = (Module["_zip_source_tell"] = asm["ha"]);
var _zip_stat = (Module["_zip_stat"] = asm["ia"]);
var _zip_stat_index = (Module["_zip_stat_index"] = asm["ja"]);
var _zip_ext_count_symlinks = (Module["_zip_ext_count_symlinks"] = asm["ka"]);
var ___errno_location = (Module["___errno_location"] = asm["la"]);
var __get_tzname = (Module["__get_tzname"] = asm["ma"]);
var __get_daylight = (Module["__get_daylight"] = asm["na"]);
var __get_timezone = (Module["__get_timezone"] = asm["oa"]);
var stackSave = (Module["stackSave"] = asm["pa"]);
var stackRestore = (Module["stackRestore"] = asm["qa"]);
var stackAlloc = (Module["stackAlloc"] = asm["ra"]);
var _malloc = (Module["_malloc"] = asm["sa"]);
var _free = (Module["_free"] = asm["ta"]);
var dynCall_vi = (Module["dynCall_vi"] = asm["ua"]);
Module["cwrap"] = cwrap;
Module["getValue"] = getValue;
var calledRun;
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}
dependenciesFulfilled = function runCaller() {
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller;
};
function run(args) {
  args = args || arguments_;
  if (runDependencies > 0) {
    return;
  }
  preRun();
  if (runDependencies > 0) return;
  function doRun() {
    if (calledRun) return;
    calledRun = true;
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(function() {
      setTimeout(function() {
        Module["setStatus"]("");
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module["run"] = run;
if (Module["preInit"]) {
  if (typeof Module["preInit"] == "function")
    Module["preInit"] = [Module["preInit"]];
  while (Module["preInit"].length > 0) {
    Module["preInit"].pop()();
  }
}
noExitRuntime = true;
run();


/***/ }),

/***/ 417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 282:
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 304:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 835:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
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
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(936);
/******/ })()
.default;
});