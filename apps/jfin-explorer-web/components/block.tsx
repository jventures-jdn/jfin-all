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

export function BlocksListComponentDemo(props: { count: number; blockNumber?: number }) {
    const { currentBlockNumber } = props.blockNumber
        ? useBlockscout().blocks().listMeta()
        : useBlockscout().blocks().meta()

    return (
        <div>
            {currentBlockNumber &&
                Array.from({ length: props.count }).map((val, index) => {
                    const calculatedBlockNumber = currentBlockNumber - index
                    if (calculatedBlockNumber > 0) {
                        return (
                            <div key={index}>
                                <BlockComponentDemo blockNumber={calculatedBlockNumber} scrape />
                            </div>
                        )
                    }
                    return null
                })}
        </div>
    )
}
