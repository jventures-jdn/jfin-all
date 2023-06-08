'use client'

import { useBlockscout } from '@libs/blockscout-client-react'
import { BlocksListComponentDemo } from '../components/block'
import { TransactionsListComponentDemo } from '../components/transaction'
import { StatsListComponentDemo } from '../components/stats'

export default function HomePage() {
    // Create Websocket Connection
    const ws = useBlockscout().webSocket({
        newBlocks: true,
        newTransactions: true,
        newStats: true,
    })

    return (
        <>
            <div>WebSocket : {ws.connectionStatus}</div>
            <br />
            stats: <StatsListComponentDemo />
            <br />
            Blocks : <BlocksListComponentDemo count={4} />
            <br />
            Transactions : <TransactionsListComponentDemo count={6} />
        </>
    )
}
