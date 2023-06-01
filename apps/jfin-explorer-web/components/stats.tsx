import { useBlockscout } from '@libs/blockscout-client-react'
// import Link from 'next/link'

export function StatsComponentDemo(props: { blockTotal: any; scrape?: boolean }) {
    const { blockTotal, scrape } = props
    // Get block data, this will auto fetch if data not exist
    const stats = useBlockscout().stats().get(blockTotal, { scrape }) // set true
    if (stats.isLoading) return <span>Loading...</span>

    return <div>{JSON.stringify(stats.data)}</div>
    // return (
    //     <div>
    //         <Link href={`/stats/${blockTotal}`}>📦 {JSON.stringify(stats.data)}</Link>
    //     </div>
    // )
}

export function StatsListComponentDemo(props: { count: number }) {
    // Look for current block number
    // cuerrentBlockTotal
    const { cuerrentBlockTotal } = useBlockscout().stats().meta()
    console.log(`block_4`, typeof cuerrentBlockTotal)

    return (
        <div>
            {cuerrentBlockTotal &&
                Array.from(Array(props.count)).map((val, index) => (
                    <div key={index}>
                        <StatsComponentDemo blockTotal={cuerrentBlockTotal - index} scrape />
                    </div>
                ))}
        </div>
    )
}
