'use client'

import { useBlockscout } from '@libs/blockscout-client-react'
import { BlocksListComponentDemo } from '../components/block'
import { TransactionsListComponentDemo } from '../components/transaction'

export default function HomePage() {
    // Create Websocket Connection
    const ws = useBlockscout().webSocket({
        newBlocks: true,
        newTransactions: true,
        // onMessageReceived: data => {
        //     console.log(data)
        // },
    })

    const { connectionStatus } = ws
    const initialBlocks = useBlockscout().blocks().initial()
    const initialTransactions = useBlockscout().transactions().initial()

    return (
        <div>
            <div>Initial Blocks : {initialBlocks.isLoading ? 'Loading...' : 'Loaded'}</div>
            <div>
                Initial Transactions : {initialTransactions.isLoading ? 'Loading...' : 'Loaded'}
            </div>
            <div>Web Socket Status: {connectionStatus}</div>
            <br />

            <div>
                Blocks : <BlocksListComponentDemo count={4} />
            </div>
            <br />

            <div>
                Transactions : <TransactionsListComponentDemo count={6} />
            </div>
        </div>
    )
}
