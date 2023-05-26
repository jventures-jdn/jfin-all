import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { blockScoutWebSocketRecord } from '../store/helpers'

type BlockscoutWebSocketOptions = {
    socketUrl?: string
    newBlocks?: any
    onMessageReceived?: (data: any, rawMessage: MessageEvent) => void
}

const defaultOptions = {
    socketUrl: 'wss://exp.jfinchain.com/socket/websocket?locale=en&vsn=2.0.0',
}

export function useBlockscoutWebSocket(options?: BlockscoutWebSocketOptions) {
    const [socketUrl, setSocketUrl] = useState(options?.socketUrl || defaultOptions.socketUrl)
    // TODO: handle socket url change
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data)
            options?.onMessageReceived?.(data, lastMessage)
            blockScoutWebSocketRecord(data)
        }
    }, [lastMessage])

    // Auto send message on open
    useEffect(() => {
        if (readyState === ReadyState.CONNECTING) {
        } else if (readyState === ReadyState.OPEN) {
            if (options?.newBlocks)
                sendMessage(JSON.stringify(['12', '12', 'blocks:new_block', 'phx_join', {}]))
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
