import { blockWebSocketRecord } from './blocks'
import { transactionWebSocketRecord } from './transactions'

// Handle new data from web socket
export function blockScoutWebSocketRecord(data: any) {
    if (data[2] === 'blocks:new_block' && data[3] === 'new_block') {
        blockWebSocketRecord(data)
    } else if (data[2] === 'transactions:new_transaction' && data[3] === 'transaction') {
        transactionWebSocketRecord(data)
    }
}
