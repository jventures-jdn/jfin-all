import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { blockScoutWebSocketRecord, clearInitialData } from '../store/helpers'

type BlockscoutWebSocketOptions = {
    socketUrl?: string
    /** Receive new block messages */
    newBlocks?: any
    /** Receive new transaction messages */
    newTransactions?: any
    onMessageReceived?: (data: any, rawMessage: MessageEvent) => void
}

const defaultOptions = {
    socketUrl: 'wss://exp.jfinchain.com/socket/websocket?locale=en&vsn=2.0.0',
}

export function useBlockscoutWebSocket(options?: BlockscoutWebSocketOptions) {
    // Socket url
    const [socketUrl] = useState(options?.socketUrl || defaultOptions.socketUrl)

    // WebSocket hook
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        socketUrl,
        // Reconnection settings
        {
            shouldReconnect: closeEvent => true,
            reconnectAttempts: 10,
            reconnectInterval: attemptNumber => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
        },
    )

    // Handle when new message received
    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data)
            options?.onMessageReceived?.(data, lastMessage)
            blockScoutWebSocketRecord(data)
        }
    }, [lastMessage])

    // Handle when connection state changed
    useEffect(() => {
        if (readyState === ReadyState.CLOSED) {
            // Auto clear initial data when connection closed
            // (So that new data is auto fetched when reconnected)
            clearInitialData()
        } else if (readyState === ReadyState.OPEN) {
            // Auto send message on open
            if (options?.newBlocks)
                sendMessage(JSON.stringify(['12', '12', 'blocks:new_block', 'phx_join', {}]))
            if (options?.newTransactions)
                sendMessage(
                    JSON.stringify(['18', '18', 'transactions:new_transaction', 'phx_join', {}]),
                )
        }
    }, [readyState])

    // Map connection state to readable text, useful for debugging
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState]

    return {
        sendMessage,
        lastMessage,
        readyState,
        connectionStatus,
    }
}
