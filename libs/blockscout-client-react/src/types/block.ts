export type Block = {
    block_number: number
    miner_hash: string
    gas_used: string

    // internal use
    is_full_data: boolean
}
