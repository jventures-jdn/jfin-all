import { GlobalConfig } from '@utils/global-config'

export class GraphQLFetcher {
    static async query<T>(query: any, parse: (response: any) => T) {
        console.log('🌏', 'query ===>', query)
        const _fetch = await fetch(`https://exp.jfinchain.com/graphiql`, {
            method: 'POST',
            headers: {
                ['Content-type']: `application/json`,
                Accept: 'application/json',
            },
            body: JSON.stringify({ query }),
        })

        const response = await _fetch.json()
        const parsed = parse(response)
        console.log('✅', response, '===>', parsed)
        return parsed
    }
}
