import { useBlockscout } from '@libs/blockscout-client-react'
import { useState, useEffect } from 'react'

export function StatsListComponentDemo() {
    const [statsInfo, setStatsInfo] = useState({
        totalAddresses: undefined,
        totalBlocks: undefined,
        totalTransactions: undefined,
        averageBlockTime: undefined,
    })

    // Look for current block number
    const { cuerrentBlockTotal } = useBlockscout().stats().meta()

    // Get block data, this will auto fetch if data not exist
    const stats = useBlockscout().stats().get(cuerrentBlockTotal, { scrape: true })

    useEffect(() => {
        setStatsInfo(statsInfo => {
            return {
                totalAddresses: stats.data?.total_addresses || statsInfo.totalAddresses,
                totalTransactions: stats.data?.total_transactions || statsInfo.totalTransactions,
                averageBlockTime: stats.data?.average_block_time || statsInfo.averageBlockTime,
                totalBlocks: stats.data?.total_blocks || statsInfo.totalBlocks,
            }
        })
    }, [stats.data])

    if (stats.isLoading) return <span>Loading...</span>

    return (
        <div>
            <div>Average block time:{statsInfo.averageBlockTime}</div>
            <div>Total transactions:{statsInfo.totalTransactions}</div>
            <div>Total blocks:{statsInfo.totalBlocks}</div>
            <div>Wallet addresses:{statsInfo.totalAddresses}</div>
        </div>
    )
}
