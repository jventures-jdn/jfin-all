export class RESTFetcher {
    static async apiv2Get(path: string) {
        const url = `https://exp.jfinchain.com/api/v2${path}`
        console.log('🌏', `[${path}]`, '==>', url)
        const _fetch = await fetch(url, { method: 'GET' })
        const result = await _fetch.json()
        console.log('✅', `[${path}]`, '==>', result)
        return result
    }
}
