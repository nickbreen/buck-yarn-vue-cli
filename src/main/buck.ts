import {execFile} from 'child_process'
import {createInterface} from 'readline'

export const locatorPattern = /(?<proto>buck):(?<package>.+)/
// buck build target pattern from https://buck.build/concept/build_target.html
export const descriptorPattern = /(?<proto>buck):(?<target>(?<cell>[A-Za-z0-9._-]*)\/\/(?<path>[A-Za-z0-9/._-]*):(?<rule>[A-Za-z0-9_/.=,@~+-]+))/

export async function targetOutputs(targets: string[])
{
    const {stdout} = execFile('buck', ['targets', '--show-full-output', ...targets])

    const lines = createInterface({input: stdout});

    const outputsByTarget = new Map<string, string>()

    for await (const line of lines) {
        const [target, output] = line.split(/\s+/, 2)
        outputsByTarget.set(target, output)
    }

    return outputsByTarget
}
