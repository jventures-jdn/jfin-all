export type Stats = {
    average_block_time: number //average_block_time
    total_blocks: number // block_number
    total_transactions: string
    total_addresses: string //count
    // TODO: more fields

    // internal use
    data_source: 'init' | 'ws' | 'fetch'
    is_full_data: boolean
}
