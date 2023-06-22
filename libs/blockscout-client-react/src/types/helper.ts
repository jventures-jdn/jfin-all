export type HelperStats = {
    count: HelperWebSocketCount
    block_number: HelperWebSocketBlock
    average_block_time: string
    transaction_hash: HelperWebSocketTransaction
}

export interface HelperWebSocketBlock {
    //ws block
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
