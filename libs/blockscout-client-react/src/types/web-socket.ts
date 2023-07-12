export type WebSocket = {
    eventNewType: 'blocks:new_block' | 'transactions:new_transaction' | 'addresses:new_address'
    eventType: 'new_block' | 'transaction' | 'count'
    webSocketAllObjectType: WebSocketBlock | WebSocketTransaction | WebSocketCount
}

export interface WebSocketBlock {
    //ws block
    average_block_time: string
    block_html: string
    block_miner_hash: string
    block_number: number
    chain_block_html: string
}
export interface WebSocketTransaction {
    //ws Transaction
    transaction_hash: string
}
export interface WebSocketCount {
    //ws count
    count: string
}
