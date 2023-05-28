export type Block = {
    block_number: number
    nonce: string
    hash: string
    parent_hash: string
    miner: string
    difficulty: string
    gas_used: string
    gas_limit: string

    // internal use
    data_source: 'init' | 'ws' | 'fetch'
    is_full_data: boolean
}
