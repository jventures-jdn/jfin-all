import { blockStoreSet } from './blocks'
import { transactionStoreSet } from './transactions'

export function blockScoutWebSocketRecord(data: any) {
    if (data[2] === 'blocks:new_block' && data[3] === 'new_block')
        blockStoreSet(data[4].block_number, {
            block_number: data[4].block_number,
            miner: data[4].block_miner_hash,
        })
    else if (data[2] === 'transactions:new_transaction' && data[3] === 'transaction') {
        transactionStoreSet(data[4].transaction_hash, {
            hash: data[4].transaction_hash,
        })
    }
}
