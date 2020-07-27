"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetOutputs = exports.descriptorPattern = exports.locatorPattern = void 0;
const child_process_1 = require("child_process");
const readline_1 = require("readline");
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
