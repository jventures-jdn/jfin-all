import { blockStoreInitialClear, blockWebSocketRecord } from './blocks'
import { transactionStoreInitialClear, transactionWebSocketRecord } from './transactions'

type eventNewType = 'blocks:new_block' | 'transactions:new_transaction' | 'addresses:new_address'
type eventType = 'new_block' | 'transaction' | 'count'

// Handle new data from web socket
// export function blockScoutWebSocketRecord(data: any) {
//     if (data[2] === 'blocks:new_block' && data[3] === 'new_block') {
//         blockWebSocketRecord(data)
//     } else if (data[2] === 'transactions:new_transaction' && data[3] === 'transaction') {
//         transactionWebSocketRecord(data)
//     }
// }

export function blockScoutWebSocketRecord([, , eventNewType, newDataWebSocket, dataObject]: [
    string | null,
    string | null,
    eventNewType,
    eventType,
    Object,
]) {
    console.log('helper___ blockScoutWebSocketRecord', Object)

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
