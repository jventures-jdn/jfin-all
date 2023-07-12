import { blockStoreInitialClear, blockWebSocketRecord } from './blocks'
import { transactionStoreInitialClear, transactionWebSocketRecord } from './transactions'
import { HelperWebSocketBlock, HelperWebSocket, HelperWebSocketTransaction } from '../types'
import { statsStoreInitialClear, statsWebSocketRecord } from './stats'

// Handle new data from web socket
export function blockScoutWebSocketRecord([, , eventNewType, newDataWebSocket, dataObject]: [
    string | null,
    string | null,
    HelperWebSocket['eventNewType'],
    HelperWebSocket['eventType'],
    HelperWebSocket['HelpedWebSocket'],
]) {
    if (eventNewType === 'blocks:new_block' && newDataWebSocket === 'new_block') {
        blockWebSocketRecord(dataObject as HelperWebSocketBlock)
        statsWebSocketRecord(dataObject)
    } else if (
        eventNewType === 'transactions:new_transaction' &&
        newDataWebSocket === 'transaction'
    ) {
        transactionWebSocketRecord(dataObject as HelperWebSocketTransaction)

        statsWebSocketRecord(dataObject)
    } else if (eventNewType === 'addresses:new_address' && newDataWebSocket === 'count') {
        statsWebSocketRecord(dataObject)
    }
}
// Handle when websocket just closed
export function clearInitialData() {
    blockStoreInitialClear()
    transactionStoreInitialClear()
    statsStoreInitialClear()
}
