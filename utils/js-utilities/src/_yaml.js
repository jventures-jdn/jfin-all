const yaml = require('js-yaml')
const pako = require('pako')

class YamlUtilities {
    static minify(data, options) {
        let result = yaml
            .dump(data, {
                noCompatMode: true,
                flowLevel: 0,
            })
            .trim()
        if (options?.compress) {
            const compressed = pako.deflate(result, { level: 6 })
            result = Buffer.from(compressed).toString('base64')
        }
        return result
    }

    static unminify(minifiedYamlString, options) {
        let temp = options?.uncompress
            ? pako.inflate(Buffer.from(minifiedYamlString, 'base64'), { to: 'string' })
            : minifiedYamlString
        return yaml.load(temp)
    }
}

module.exports = { YamlUtilities }
