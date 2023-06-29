import { useBlockscout } from '@libs/blockscout-client-react'
import Link from 'next/link'

//Txs
export function TxsComponentDemo(props: { blockNumber: number; scrape?: boolean }) {
    const { blockNumber, scrape } = props
    // Get block data, this will auto fetch if data not exist
    const block = useBlockscout().blocks().get(blockNumber, { scrape })
    if (block.isLoading) return <span>Loading...</span>
    console.log('txs__ TxsComponentDemo', block)

    return (
        <div>
            <Link href={`/block/${blockNumber}`} prefetch={false}>
                📦 {JSON.stringify(block.data)}
            </Link>
        </div>
    )
}

export function TxsPageListTxsComponent(props: { count: number }) {
    const { currentPageBlockNumber } = useBlockscout().blocks().meta()

    console.log('txs__ currentPageBlockNumber', currentPageBlockNumber)

    return (
        <div>
            {(currentPageBlockNumber || currentPageBlockNumber === 0) &&
                Array.from({ length: props.count }).map((val, index) => {
                    const calculatedBlockNumber = currentPageBlockNumber - index
                    // prevent negative blocks
                    if (calculatedBlockNumber >= 0) {
                        return (
                            <div key={index}>
                                <TxsComponentDemo blockNumber={calculatedBlockNumber} scrape />
                            </div>
                        )
                    }
                    return null
                })}
        </div>
    )
}
