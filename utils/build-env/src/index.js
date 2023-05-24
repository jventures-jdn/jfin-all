const { load } = require('@utils/global-config/index_')

const env = {
    TARGET: process.env.TARGET || 'development',
    NAME: process.env.NAME,
    GLOBAL_CONFIG: load(),
}
console.log('🏗️  [build env]')
console.log(
    `${Object.entries(env)
        .map(([key, value]) => `   ${key}=\x1b[35m${value?.length > 100 ? '...' : value}\x1b[0m`)
        .join('\n')}`,
)
module.exports = env
