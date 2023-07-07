export type Helper = {
    eventNewType: 'blocks:new_block' | 'transactions:new_transaction' | 'addresses:new_address'
    eventType: 'new_block' | 'transaction' | 'count'
    HelpedWebSocket: HelpeWebSocketBlack | HelperWebSocketTransaction | HelperWebSocketCount
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
}
export interface HelperWebSocketCount {
    //ws count
    count: string
}
