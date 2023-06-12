import { useBlockscout } from '@libs/blockscout-client-react'
import { useState, useEffect } from 'react'

export function StatsListComponentDemo() {
    // Look for current block number
    const { cuerrentBlockTotal } = useBlockscout().stats().meta()

    // Get block data, this will auto fetch if data not exist
    const stats = useBlockscout().stats().get(cuerrentBlockTotal, { scrape: true })

    if (stats.isLoading) return <span>Loading...</span>

    return (
        <div>
            <div>Average block time:{stats.data?.average_block_time}</div>
            <div>Total transactions:{stats.data?.total_transactions}</div>
            <div>Total blocks:{stats.data?.total_blocks}</div>
            <div>Wallet addresses:{stats.data?.total_addresses}</div>
        </div>
    )
}
