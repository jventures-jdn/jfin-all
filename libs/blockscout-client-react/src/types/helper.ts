export type HelperStats = {
    count: HelperWebSocketCount
    block_number: HelpeWebSocketBlack
    average_block_time: HelpeWebSocketBlack
    transaction_hash: HelperWebSocketTransaction
}

export interface HelpeWebSocketBlack {
    //ws black
    average_block_time: string
    block_html: string
    block_miner_hash: string
    block_number: number
    chain_block_html: string
}

export interface HelperWebSocketTransaction {
    //ws Transaction
    transaction_hash: string
    transaction_html: string
}

export interface HelperWebSocketCount {
    // replace(arg0: RegExp, arg1: any): string
    //ws count
    count: string
}
