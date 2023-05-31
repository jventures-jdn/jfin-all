export type Stats = {
    average_block_time: number
    total_addresses: string
    total_blocks: any // block_number
    total_transactions: string
    // TODO: more fields

    // internal use
    data_source: 'init' | 'ws' | 'fetch'
    is_full_data: boolean
}
