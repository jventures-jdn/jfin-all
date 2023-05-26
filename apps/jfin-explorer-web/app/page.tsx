'use client'

import { useBlockscout, ReadyState } from '@libs/blockscout-client-react'
import { BlockComponentDemo, BlocksListComponentDemo } from '../components/block'

export default function HomePage() {
    // Create Websocket Connection
    const ws = useBlockscout().webSocket({
        newBlocks: true,
        // onMessageReceived: data => {
        //     console.log(data)
        // },
    })

    // Get current block number
    const meta = useBlockscout().blocks().meta()
    const currentBlockNumber = meta?.currentBlockNumber
    const { readyState } = ws

    return (
        <div>
            {readyState === ReadyState.CONNECTING && <div>Connecting...</div>}
            {readyState === ReadyState.OPEN && !currentBlockNumber && <div>Connected</div>}
            {currentBlockNumber && (
                <>
                    <div>
                        Current :
                        <BlockComponentDemo blockNumber={currentBlockNumber} />
                    </div>
                    <div>
                        Blocks : <BlocksListComponentDemo count={6} />
                    </div>
                </>
            )}
        </div>
    )
}
