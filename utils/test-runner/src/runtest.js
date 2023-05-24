const { execSync } = require('child_process')
const { load } = require('@utils/global-config/index_')
const path = require('path')

load(true)
process.env.INVOKER_TSCONFIG_PATH = path.join(process.cwd(), 'tsconfig.json')

const [, , target, ...args] = process.argv
let select = undefined
if (target && !target.startsWith('--')) {
    if (target === 'select' && args[0]) {
        select = args[0]
    }
    console.log(
        '🎯 test target =>',
        `\x1b[45m ${process.env.PACKAGE_NAME} \x1b[0m =>`,
        `\x1b[47m ${target} \x1b[0m`,
        select ? `=> \x1b[46m ${select} \x1b[0m` : '',
    )
} else {
    console.log('🎯 test target =>', `\x1b[45m ${process.env.PACKAGE_NAME} \x1b[0m`)
}

const targetFile = target
    ? target.endsWith('.js') || target.endsWith('.ts')
        ? target
        : `${target}.test.ts`
    : undefined

const command = [
    'cross-env',
    select ? `SELECT_TEST=${select}` : undefined,
    'pnpm',
    'jest',
    targetFile ? `-i ${targetFile}` : '',
    ...(target === 'select' ? args.slice(1) : args),
    `--roots=${process.cwd()}`,
    '--passWithNoTests',
]
    .filter(i => !!i)
    .join(' ')

execSync(command, { stdio: 'inherit', cwd: `${__dirname}/..` })
