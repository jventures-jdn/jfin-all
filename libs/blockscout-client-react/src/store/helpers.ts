import { blockStoreSet } from './blocks'

export function blockScoutWebSocketRecord(data: any) {
    if (data[3] === 'new_block')
        blockStoreSet(data[4].block_number, {
            block_number: data[4].block_number,
            miner_hash: data[4].block_miner_hash,
        })
}
