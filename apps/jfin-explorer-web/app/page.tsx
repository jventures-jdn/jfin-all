'use client'

import { useBlockscout } from '@libs/blockscout-client-react'
import { BlocksListComponentDemo } from '../components/block'
import { TransactionsListComponentDemo } from '../components/transaction'
import { StatsListComponentDemo } from '../components/stats'

export default function HomePage() {
    // Create Websocket Connection
    const ws = useBlockscout().webSocket({
        newBlocks: true,
        // newTransactions: true,
        // Uncomment this line to show ws logs
        // onMessageReceived: console.log,
    })

    // const stats = useBlockscout().stats().get()
    // console.log('stats', stats.isLoading + ':' + stats.data)

    return (
        <>
            {/* <div>WebSocket : {ws.connectionStatus}</div> */}
            {/* <br /> */}
            stats: <StatsListComponentDemo count={4} />
            <br />
            Blocks : <BlocksListComponentDemo count={4} />
            <br />
            Transactions : <TransactionsListComponentDemo count={6} />
        </>
    )
}
