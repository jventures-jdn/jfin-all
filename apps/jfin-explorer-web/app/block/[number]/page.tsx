'use client'

import { useBlockscout } from '@libs/blockscout-client-react'
import { useParams } from 'next/navigation'

export default function BlockPage() {
    // Hook
    const blocks = useBlockscout().blocks()

    // Get block number from url
    const { number } = useParams()
    let blockNumber
    try {
        blockNumber = parseInt(number!)
    } catch {}
    if (!blockNumber) return <div>Invalid block number</div>

    // Get full block data
    const get = blocks.get(blockNumber)

    return (
        <div>
            <pre>{JSON.stringify(get.data, null, 2)}</pre>
            {/* Loading first time */}
            {get.isLoading && <div>Loading...</div>}
            {/* Loading second time and so on e.g. fetching full data */}
            {!get.isLoading && get.isValidating && <div>Updating...</div>}
        </div>
    )
}
