import { blockStoreInitialClear, blockWebSocketRecord } from './blocks'
import { statsStoreInitialClear, statsWebSocketRecord } from './stats'
import { transactionStoreInitialClear, transactionWebSocketRecord } from './transactions'

// Handle new data from web socket
export function blockScoutWebSocketRecord(data: any) {
    if (data[2] === 'blocks:new_block' && data[3] === 'new_block') {
        blockWebSocketRecord(data)
        statsWebSocketRecord(data) //ใช้ไปก่อน เอา average_block_time มาใช้
    } else if (data[2] === 'transactions:new_transaction' && data[3] === 'transaction') {
        transactionWebSocketRecord(data)
    }
    // else if()
}

// Handle when websocket just closed
export function clearInitialData() {
    blockStoreInitialClear()
    transactionStoreInitialClear()
    statsStoreInitialClear()
}
