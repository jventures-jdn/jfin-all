import { useBlockscoutBlocks } from '../store/blocks'
import { useBlockscoutTransactions } from '../store/transactions'
import { useBlockscoutStats } from '../store/stats'
// ws
import { useBlockscoutWebSocket } from '../websocket/use-blockscout-websocket'

export function useBlockscout() {
    return {
        webSocket: (options?: Parameters<typeof useBlockscoutWebSocket>[0]) =>
            useBlockscoutWebSocket(options),
        blocks: () => useBlockscoutBlocks(),
        transactions: () => useBlockscoutTransactions(),
        stats: () => useBlockscoutStats(),
    }
}
