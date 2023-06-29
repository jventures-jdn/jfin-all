import { RESTFetcher } from '../fetcher/rest-fetcher'

export class GlobalApis {
    static async initialBlocks() {
        return RESTFetcher.apiv2Get('/main-page/blocks')
    }

    static async initialTransactions() {
        return RESTFetcher.apiv2Get('/main-page/transactions')
    }

    static async blocks(blockNumber?: number) {
        return RESTFetcher.apiv2Get(`/blocks${blockNumber ? `?block_number=${blockNumber}` : ''}`)
    }

    static async blocksTxs(blockNumber?: number) {
        return RESTFetcher.apiv2Get(`/blocks/${blockNumber}/transactions`)
    }
}
