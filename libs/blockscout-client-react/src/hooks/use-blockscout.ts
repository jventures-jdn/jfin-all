import { useBlockscoutStoreBlocks } from '../store/blocks'
import { useBlockscoutStoreTransactions } from '../store/transactions'
import { useBlockscoutWebSocket } from '../websocket/use-blockscout-websocket'

export function useBlockscout() {
    return {
        webSocket: (options?: Parameters<typeof useBlockscoutWebSocket>[0]) =>
            useBlockscoutWebSocket(options),
        blocks: () => useBlockscoutStoreBlocks(),
        transactions: () => useBlockscoutStoreTransactions(),
    }
}
