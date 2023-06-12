////////////
// Execute command received from `run.js`
////////////

import { execSync } from 'child_process'
import { CommandTemplates } from './templates'
import { GlobalConfigDev } from '@utils/global-config'
import { PackageAnalyzer } from '@utils/package-analyzer'
import { isDocker } from '@utils/js-utilities'

// Receive arguments from `run.js`
const [a, b, invokerProjectPath, sourceNodeScript, customVariables, appendArgs] = process.argv

// Analyze the caller package
const analyzedPackage = PackageAnalyzer.analyze(invokerProjectPath)
if (!analyzedPackage.type)
    throw Error(`⛔ Can't derive application type of '${invokerProjectPath}', aborted.`)

// Construct variables from command line and package analyzer
const variables = {
    ...analyzedPackage.props,
    ...(customVariables !== '_' &&
        customVariables
            ?.split(',')
            .map(i => (i.includes('=') ? i.split('=') : [i, '1']))
            .reduce((result, [key, value]) => ({ ...result, [key]: value }), {})),
} as any

// Auto target to `development` if not provided
// For docker dev (compose), TARGET is provided via env
if (!variables.target) variables.target = process.env.TARGET || 'development'

// console.log(
//     `⚡ Variables\n${Object.entries(variables)
//         .map(([key, value]) => `${key}=\x1b[35m${value}\x1b[0m`)
//         .join('\n')}`,
// )

console.log(
    `🚧 \x1b[31m\`${sourceNodeScript}\`\x1b[0m command for`,
    analyzedPackage.type ? `\x1b[31m[${analyzedPackage.type}]` : '',
    `\x1b[36m(${analyzedPackage.json.name})`,
    '\x1b[0m',
)

// Get command template from yaml
let instructions = CommandTemplates.load(analyzedPackage.type, sourceNodeScript, variables)
if (!instructions)
    // Command template not found
    throw Error(
        `\x1b[31m⛔ Unknown command '${sourceNodeScript}' \x1b[0m(${analyzedPackage.json.name})`,
    )

instructions.forEach(({ fullEnvString, commandTemplate }) => {
    // Finalize the command and execute it under the invoker project location
    const finalCommand = [
        fullEnvString && 'cross-env',
        fullEnvString,
        commandTemplate.command,
        appendArgs === '_' ? commandTemplate.defaultArgs : appendArgs.split(',').join(' '),
    ]
        .filter(i => !!i)
        .join(' ')

    console.log('🚥\x1b[33m', finalCommand, '\x1b[0m')

    const tempConfigFile = `config_target_${variables.target}`
    switch (commandTemplate.globalConfig) {
        case 'dev':
            // because we use `build` command in docker, so sync(ignoreDefault) to only sync system info
            GlobalConfigDev.sync(isDocker())
            break
        case 'docker':
            GlobalConfigDev.copyLocalConfigFileTo(tempConfigFile)
            break
        case 'deploy':
            GlobalConfigDev.createDefaultConfigFile(variables.target, tempConfigFile)
            break
    }

    try {
        execSync(finalCommand, { stdio: 'inherit', cwd: `../../${invokerProjectPath}` })
    } catch (e: any) {
        console.log(`🚨 \x1b[31m\`${sourceNodeScript}\` command error ❗\x1b[0m`, `"${e.message}"`)
    } finally {
        GlobalConfigDev.deleteConfigFile(tempConfigFile)
    }
})
