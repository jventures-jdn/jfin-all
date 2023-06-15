export type Transaction = {
    hash: string
    block_number: number
    // TODO: more fields

    // internal use
    data_source: 'init' | 'ws' | 'fetch'
    is_full_data: boolean
}

export interface TransactionWebSocket {
    transaction_hash: string
    transaction_html: string
}
