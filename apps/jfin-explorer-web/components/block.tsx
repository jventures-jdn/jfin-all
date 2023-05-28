import { useBlockscout } from '@libs/blockscout-client-react'
import Link from 'next/link'

export function BlockComponentDemo(props: { blockNumber: number; fullData?: boolean }) {
    const { blockNumber, fullData } = props
    const block = useBlockscout().blocks().get(blockNumber, { fullData })
    if (block.isLoading) return <span>Loading...</span>
    return (
        <div>
            <Link href={`/block/${blockNumber}`}>📦 {JSON.stringify(block.data)}</Link>
        </div>
    )
}

export function BlocksListComponentDemo(props: { count: number }) {
    const currentBlockNumber = useBlockscout().blocks().meta().data?.currentBlockNumber
    if (!currentBlockNumber) return null
    return (
        <div>
            {Array.from(Array(props.count)).map((val, index) => (
                <div key={index}>
                    <BlockComponentDemo blockNumber={currentBlockNumber - index} />
                </div>
            ))}
        </div>
    )
}
