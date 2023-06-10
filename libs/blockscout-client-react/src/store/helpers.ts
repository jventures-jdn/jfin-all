import { blockStoreInitialClear, blockWebSocketRecord } from './blocks'
import { transactionStoreInitialClear, transactionWebSocketRecord } from './transactions'
import { Helper } from '../types'

// Handle new data from web socket
export function blockScoutWebSocketRecord([, , eventNewType, newDataWebSocket, dataObject]: [
    string | null,
    string | null,
    Helper['eventNewType'],
    Helper['eventType'],
    Object,
]) {
    if (eventNewType === 'blocks:new_block' && newDataWebSocket === 'new_block') {
        blockWebSocketRecord(dataObject)
    } else if (
        eventNewType === 'transactions:new_transaction' &&
        newDataWebSocket === 'transaction'
    ) {
        transactionWebSocketRecord(dataObject)
    }
}
// Handle when websocket just closed
export function clearInitialData() {
    blockStoreInitialClear()
    transactionStoreInitialClear()
}
