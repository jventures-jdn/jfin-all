const fs = require('fs')
const path = require('path')
const { yaml, yamls } = require('@utils/js-utilities/index_')

// Load global .config.yaml to json object, for builders
module.exports = toProcessEnv => {
    const globalConfigPath = path.join(process.cwd(), `../../.config.yaml`)
    const exists = fs.existsSync(globalConfigPath)
    if (!exists) throw Error('⛔ Global config file not found')
    const result = yaml.load(fs.readFileSync(globalConfigPath).toString())
    const minified = yamls.YamlUtilities.minify(result)
    if (toProcessEnv === true) {
        process.env.GLOBAL_CONFIG = minified
    }
    return minified
}
