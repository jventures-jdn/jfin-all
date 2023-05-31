import { useBlockscout } from '@libs/blockscout-client-react'
import Link from 'next/link'

export function StatsComponentDemo(props: { scrape?: boolean }) {
    const { scrape } = props
    console.log('scrape', scrape)

    // Get block data, this will auto fetch if data not exist
    const stats = useBlockscout().stats().get()
    // if (stats.isLoading) return <span>Loading...</span>
    console.log('StatsComponentDemo=>stats', stats)
    return <div> {`stats`} </div>
}

export function StatsListComponentDemo() {
    // Look for current block number
    // const { currentBlockNumber } = useBlockscout().blocks().meta()

    return (
        <div>
            <StatsComponentDemo scrape />

            {/* {currentBlockNumber &&
                Array.from(Array(props.count)).map((val, index) => (
                    <div key={index}>
                        {index}
                        <br />
                        {currentBlockNumber}
                        <BlockComponentDemo blockNumber={currentBlockNumber - index} scrape />
                    </div>
                ))} */}
        </div>
    )
}
