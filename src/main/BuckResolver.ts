import {promisify} from 'util'
import {execFile as cbExecFile} from 'child_process'
import {createInterface} from 'readline'
import {Readable} from 'stream'
import {structUtils} from '@yarnpkg/core'

import {LinkResolver} from "./LinkResolver"

const execFile = promisify(cbExecFile);

export class BuckResolver extends LinkResolver {
    supportsDescriptor(locator, opts) {
        return locator.range.startsWith('buck:')
    }

    supportsLocator(locator, opts) {
        return locator.reference.startsWith('buck:')
    }

    async getCandidates(descriptor, dependencies, opts) {
        const path = descriptor.range.slice('buck:'.length, descriptor.range.indexOf("::"))

        const {stdout} = await execFile('buck', ['targets', '--show-full-output', path])

        const lines = createInterface({input: stdout as unknown as Readable});

        const candidates = []

        for await (const line of lines) {
            const [target, output] = line.split(/\s+/, 2);
            candidates.push(structUtils.makeLocator({...descriptor, name: target}, `portal:${output}`))
        }

        return candidates
    }
}