import { blockStoreInitialClear, blockWebSocketRecord } from './blocks'
import { transactionStoreInitialClear, transactionWebSocketRecord } from './transactions'
import { statsStoreInitialClear, statsWebSocketRecord } from './stats'

// Handle new data from web socket
export function blockScoutWebSocketRecord(data: any) {
    if (data[2] === 'blocks:new_block' && data[3] === 'new_block') {
        blockWebSocketRecord(data)
        statsWebSocketRecord(data)
    } else if (data[2] === 'transactions:new_transaction' && data[3] === 'transaction') {
        transactionWebSocketRecord(data)
        statsWebSocketRecord(data)
    } else if (data[2] === 'addresses:new_address' && data[3] === 'count') {
        console.log(`blockScoutWebSocketRecord ${data}`)
        statsWebSocketRecord(data)
    }
}

// Handle when websocket just closed
export function clearInitialData() {
    blockStoreInitialClear()
    transactionStoreInitialClear()
    statsStoreInitialClear()
}
