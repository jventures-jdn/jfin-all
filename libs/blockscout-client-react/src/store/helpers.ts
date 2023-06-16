import { blockStoreInitialClear, blockWebSocketRecord } from './blocks'
import { transactionStoreInitialClear, transactionWebSocketRecord } from './transactions'
import { HelpeWebSocketBlack, Helper, HelperWebSocketTransaction } from '../types'

// Handle new data from web socket
export function blockScoutWebSocketRecord([, , eventNewType, newDataWebSocket, dataObject]: [
    string | null,
    string | null,
    Helper['eventNewType'],
    Helper['eventType'],
    Helper['HelpedWebSocket'],
]) {
    if (eventNewType === 'blocks:new_block' && newDataWebSocket === 'new_block') {
        blockWebSocketRecord(dataObject as HelpeWebSocketBlack)
    } else if (
        eventNewType === 'transactions:new_transaction' &&
        newDataWebSocket === 'transaction'
    ) {
        transactionWebSocketRecord(dataObject as HelperWebSocketTransaction)
    }
}
// Handle when websocket just closed
export function clearInitialData() {
    blockStoreInitialClear()
    transactionStoreInitialClear()
}
