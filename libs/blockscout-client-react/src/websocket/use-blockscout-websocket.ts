import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { blockScoutWebSocketRecord, clearInitialData } from '../store/helpers'

type BlockscoutWebSocketOptions = {
    socketUrl?: string
    newBlocks?: any
    newTransactions?: any
    onMessageReceived?: (data: any, rawMessage: MessageEvent) => void
}

const defaultOptions = {
    socketUrl: 'wss://exp.jfinchain.com/socket/websocket?locale=en&vsn=2.0.0',
}

export function useBlockscoutWebSocket(options?: BlockscoutWebSocketOptions) {
    const [socketUrl, setSocketUrl] = useState(options?.socketUrl || defaultOptions.socketUrl)

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: closeEvent => true,
        reconnectAttempts: 10,
        reconnectInterval: attemptNumber => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    })

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data)
            options?.onMessageReceived?.(data, lastMessage)
            blockScoutWebSocketRecord(data)
        }
    }, [lastMessage])

    // Auto send message on open
    useEffect(() => {
        if (readyState === ReadyState.CLOSED) {
            clearInitialData()
        } else if (readyState === ReadyState.OPEN) {
            if (options?.newBlocks)
                sendMessage(JSON.stringify(['12', '12', 'blocks:new_block', 'phx_join', {}]))
            if (options?.newTransactions)
                sendMessage(
                    JSON.stringify(['18', '18', 'transactions:new_transaction', 'phx_join', {}]),
                )
        }
    }, [readyState])

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
