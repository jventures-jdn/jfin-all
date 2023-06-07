import { useBlockscout } from '@libs/blockscout-client-react'

let resultAverageBlockTime: string
let resultTotalAddresses: string
let resultTotalBlocks: string
let resultTotalTransactions: string

export function StatsComponentDemo(props: { blockTotal: any; scrape?: boolean }) {
    const { blockTotal, scrape } = props

    // Get block data, this will auto fetch if data not exist
    const stats = useBlockscout().stats().get(blockTotal, { scrape }) // set true
    if (stats.isLoading) return <span>Loading...</span>

    if (stats.data?.total_addresses) {
        resultTotalAddresses = stats.data.total_addresses
    }
    if (stats.data?.total_transactions) {
        resultTotalTransactions = stats.data.total_transactions
    }
    if (stats.data?.average_block_time) {
        resultAverageBlockTime = stats.data.average_block_time
    }
    if (stats.data?.total_blocks) {
        resultTotalBlocks = stats.data.total_blocks
    }

    // return <div>{JSON.stringify(stats.data)}</div>
    return (
        <div>
            <div>Average block time:{resultAverageBlockTime}</div>
            <div>Total transactions:{resultTotalTransactions}</div>
            <div>Total blocks:{resultTotalBlocks}</div>
            <div>Wallet addresses:{resultTotalAddresses}</div>
        </div>
    )
}

export function StatsListComponentDemo() {
    // Look for current block number
    const { cuerrentBlockTotal } = useBlockscout().stats().meta()

    return (
        <div>
            <div>{<StatsComponentDemo blockTotal={cuerrentBlockTotal} scrape />}</div>
        </div>
    )
}
