export type Transaction = {
    hash: string
    block_number: number

    // internal use
    data_source: 'init' | 'ws' | 'fetch'
    is_full_data: boolean
}
