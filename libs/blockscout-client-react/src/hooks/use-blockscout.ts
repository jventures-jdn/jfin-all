import { useBlockscoutStoreBlocks } from '../store/use-blockscout-store-blocks'
import { useBlockscoutWebSocket } from '../websocket/use-blockscout-websocket'

export function useBlockscout() {
    return {
        webSocket: (options?: Parameters<typeof useBlockscoutWebSocket>[0]) =>
            useBlockscoutWebSocket(options),
        blocks: () => useBlockscoutStoreBlocks(),
    }
}
