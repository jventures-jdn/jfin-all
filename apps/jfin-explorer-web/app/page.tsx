'use client'

import { useBlockscout } from '@libs/blockscout-client-react'
import { BlocksListComponentDemo } from '../components/block'
import { TransactionsListComponentDemo } from '../components/transaction'

export default function HomePage() {
    // Create Websocket Connection
    const ws = useBlockscout().webSocket({
        newBlocks: true,
        newTransactions: true,
        // Uncomment this line to show ws logs
        // onMessageReceived: console.log,
    })

    return (
        <>
            <div>WebSocket : {ws.connectionStatus}</div>
            <br />
            Blocks : <BlocksListComponentDemo count={4} />
            <br />
            Transactions : <TransactionsListComponentDemo count={6} />
        </>
    )
}
