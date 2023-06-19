export type HelperStats = {
    count: HelperWebSocketCount
    block_number: HelperWebSocketBlack
    average_block_time: HelperWebSocketBlack
    transaction_hash: HelperWebSocketTransaction
}

export interface HelperWebSocketBlack {
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
}

export interface HelperWebSocketCount {
    //ws count
    count: string
}
