import { useBlockscout } from '@libs/blockscout-client-react'
import Link from 'next/link'

export function BlockComponentDemo(props: { blockNumber: number; scrape?: boolean }) {
    const { blockNumber, scrape } = props
    // Get block data, this will auto fetch if data not exist
    const block = useBlockscout().blocks().get(blockNumber, { scrape })
    if (block.isLoading) return <span>Loading...</span>
    return (
        <div>
            <Link href={`/block/${blockNumber}`}>📦 {JSON.stringify(block.data)}</Link>
        </div>
    )
}

export function BlocksListComponentDemo(props: { count: number }) {
    // Auto fetch initial blocks
    useBlockscout().blocks().initial()
    // Look for current block number
    const currentBlockNumber = useBlockscout().blocks().meta().data?.currentBlockNumber
    if (!currentBlockNumber) return null
    return (
        <div>
            {Array.from(Array(props.count)).map((val, index) => (
                <div key={index}>
                    <BlockComponentDemo blockNumber={currentBlockNumber - index} scrape />
                </div>
            ))}
        </div>
    )
}
