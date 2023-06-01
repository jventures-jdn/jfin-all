import { useBlockscout } from '@libs/blockscout-client-react'

let testData: any
export function StatsComponentDemo(props: { blockTotal: any; scrape?: boolean }) {
    const { blockTotal, scrape } = props

    // Get block data, this will auto fetch if data not exist
    const stats = useBlockscout().stats().get(blockTotal, { scrape }) // set true
    if (stats.isLoading) return <span>Loading...</span>
    return <div>{JSON.stringify(stats.data)}</div>
}

export function StatsComponentDemoCount(props: { countTotal: any }) {
    return (testData = props.countTotal)
}
export function StatsListComponentDemo(props: { count: number }) {
    // Look for current block number
    const { cuerrentBlockTotal, cuerrentcountTotal } = useBlockscout().stats().meta()

    return (
        <div>
            {(cuerrentBlockTotal &&
                Array.from(Array(props.count)).map((val, index) => (
                    <div key={index}>
                        <StatsComponentDemo blockTotal={cuerrentBlockTotal - index} scrape />
                    </div>
                ))) ||
                (cuerrentcountTotal &&
                    Array.from(Array(props.count)).map((val, index) => (
                        <div key={index}>
                            <StatsComponentDemoCount countTotal={cuerrentcountTotal} />
                        </div>
                    )))}

            <div>{testData}</div>
        </div>
    )
}
