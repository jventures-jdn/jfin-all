import { useBlockscout } from '@libs/blockscout-client-react'

export function StatsComponentDemo(props: { blockTotal: any; scrape?: boolean }) {
    const { blockTotal, scrape } = props
    console.log('props', props)
    // console.log('scrape', scrape)

    // Get block data, this will auto fetch if data not exist
    // const stats = useBlockscout().stats().get({ scrape: true }) // set true
    const stats = useBlockscout().stats().get(blockTotal, { scrape }) // set true
    if (stats.isLoading) return <span>Loading...</span>
    console.log('currentStats => stats', stats)
    return <div> {JSON.stringify(stats.data)} </div>
}

export function StatsListComponentDemo(props: { count: number }) {
    // Look for current block number
    const { currentStats } = useBlockscout().stats().meta()
    console.log(`currentStats ${currentStats}`)
    return (
        <div>
            {currentStats &&
                Array.from(Array(props.count)).map((val, index) => (
                    <div key={index}>
                        <StatsComponentDemo blockTotal={currentStats - index} scrape />
                    </div>
                ))}
        </div>
    )
}
