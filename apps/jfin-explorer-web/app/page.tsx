'use client'

import { useBlockscout, ReadyState } from '@libs/blockscout-client-react'
import { BlockComponentDemo, BlocksListComponentDemo } from '../components/block'
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

    // Get current block number
    const { currentBlockNumber } = useBlockscout().blocks().meta()
    const { latestTransactions } = useBlockscout().transactions().meta()
    const { readyState } = ws

    return (
        <div>
            {readyState === ReadyState.CONNECTING && <div>Connecting...</div>}
            {readyState === ReadyState.OPEN && !currentBlockNumber && <div>Waiting Data</div>}

            {currentBlockNumber && (
                <>
                    <div>
                        Blocks : <BlocksListComponentDemo count={6} />
                    </div>
                    <div>
                        Transactions : <TransactionsListComponentDemo count={6} />
                    </div>
                </>
            )}
        </div>
    )
}
