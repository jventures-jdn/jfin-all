export class GlobalApis {
    static async initialBlocks() {
        const _fetch = await fetch(`https://exp.jfinchain.com/api/v2/main-page/blocks`, {
            method: 'GET',
        })
        const json = await _fetch.json()
        return json
    }

    static async blocks() {
        const _fetch = await fetch(`https://exp.jfinchain.com/api/v2/blocks`, {
            method: 'GET',
        })
        const json = await _fetch.json()
        return json
    }
}
