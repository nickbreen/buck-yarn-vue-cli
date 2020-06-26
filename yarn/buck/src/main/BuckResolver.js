const {structUtils} = require('@yarnpkg/core')
const {LinkResolver} = require("@yarnpkg/plugin-link/lib/LinkResolver")
const {promisify} = require('util')
const execFile = promisify(require('child_process').execFile)
const {createInterface} = require('readline')

module.exports = class BuckResolver extends LinkResolver {
    supportsDescriptor(locator, opts) {
        return locator.range.startsWith('buck:')
    }

    supportsLocator(locator, opts) {
        return locator.reference.startsWith('buck:')
    }

    async getCandidates(descriptor, dependencies, opts) {
        const path = descriptor.range.slice('buck:'.length)

        const {stdout} = await execFile('buck', ['targets', '--show-full-output', path])

        const lines = createInterface({input: stdout});

        const candidates = []

        for await (const line of lines) {
            const [target, output] = line.split(/\s+/, 2);
            candidates.push(structUtils.makeLocator({...descriptor, name: target}, `portal:${output}`))
        }

        return candidates
    }
}