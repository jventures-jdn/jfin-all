import { GlobalConfig } from '@utils/global-config'

export class RESTFetcher {
    static async apiv2Get<T>(path: string, parser?: (data: any) => T) {
        const url = `${GlobalConfig.endpoint('apiv2')}${path}`
        console.log('🌏', `[${path}]`, '==>', url)
        const _fetch = await fetch(url, { method: 'GET' })
        const result = await _fetch.json()
        if (parser) {
            const parsed = parser(result)
            console.log('✅', `[${path}]`, '==>', result, '==>', parsed)
            return parsed
        } else {
            console.log('✅', `[${path}]`, '==>', result)
            return result
        }
    }
}
