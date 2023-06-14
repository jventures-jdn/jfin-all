export type Stats = {
    average_block_time: number //average_block_time
    total_blocks: string // block_number
    total_transactions: string
    total_addresses: string //count
    // TODO: more fields

    // internal use
    data_source: 'init' | 'ws' | 'fetch'
    is_full_data: boolean
}

export type StatsBlock = {
    block_number: number //average_block_time
    average_block_time: number // block_number
}
export type StatsAddresses = {
    count: string
}
