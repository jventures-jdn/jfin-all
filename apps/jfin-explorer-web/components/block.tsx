import { useBlockscout } from '@libs/blockscout-client-react'
import Link from 'next/link'

export function BlockComponentDemo(props: { blockNumber: number; scrape?: boolean }) {
    const { blockNumber, scrape } = props
    // Get block data, this will auto fetch if data not exist
    const block = useBlockscout().blocks().get(blockNumber, { scrape })
    if (block.isLoading) return <span>Loading...</span>
    return (
        <div>
            <Link href={`/block/${blockNumber}`} prefetch={false}>
                📦 {JSON.stringify(block.data)}
            </Link>
        </div>
    )
}

export function BlocksListComponentDemo(props: { count: number }) {
    // Look for current block number
    const { currentBlockNumber } = useBlockscout().blocks().meta()

    return (
        <div>
            {currentBlockNumber &&
                Array.from(Array(props.count)).map((val, index) => (
                    <div key={index}>
                        <BlockComponentDemo blockNumber={currentBlockNumber - index} scrape />
                    </div>
                ))}
        </div>
    )
}
