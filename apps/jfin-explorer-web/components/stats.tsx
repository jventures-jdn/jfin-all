import { useBlockscout } from '@libs/blockscout-client-react'

export function StatsComponentDemo() {
    // Look for current block number
    const { cuerrentTotalBlock } = useBlockscout().stats().meta()

    const stats = useBlockscout().stats().get(cuerrentTotalBlock, { scrape: true })

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
