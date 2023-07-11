export type Txs = {
    block_number: number
    nonce: string
    hash: string
    parent_hash: string
    miner: string
    difficulty: string
    gas_used: string
    gas_limit: string
    raw_input: string
    to_hash: string
    from_hash: string
    value: string
    fee: string
    timestamp: string
    transaction_success: string
    // TODO: more fields

    // internal use
    //txs txs1 :test
    data_source: 'ggg' | 'init' | 'ws' | 'fetch' | 'txs'
    is_full_data: boolean
}
