import { yaml, cryptos, pako } from '..'

export class YamlUtilities {
    static minify(data: any, options?: { compress?: boolean }) {
        let result = yaml
            .dump(data, {
                noCompatMode: true,
                flowLevel: 0,
            })
            .trim()
        if (options?.compress) {
            const compressed = pako.deflate(result, { level: 6 })
            result = cryptos.base64Encode(compressed)
        }
        return result
    }

    static unminify(minifiedYamlString: string, options?: { uncompress?: boolean }) {
        let temp = options?.uncompress
            ? pako.inflate(cryptos.base64DecodeToAny(minifiedYamlString), { to: 'string' })
            : minifiedYamlString
        return yaml.load(temp) as any
    }
}
