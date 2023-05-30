import { useBlockscout } from '@libs/blockscout-client-react'
import Link from 'next/link'

export function TransactionComponentDemo(props: { transactionHash: string; scrape?: boolean }) {
    const { transactionHash, scrape } = props
    // Get transaction data, this will auto fetch if data not exist
    const tx = useBlockscout().transactions().get(transactionHash, { scrape })
    if (tx.isLoading) return <span>Loading...</span>
    return (
        <div>
            <Link href={`/tx/${transactionHash}`}>📦 {JSON.stringify(tx.data)}</Link>
        </div>
    )
}

export function TransactionsListComponentDemo(props: { count: number }) {
    // look for latest transactions
    const { latestTransactions } = useBlockscout().transactions().meta()
    return (
        <div>
            {latestTransactions &&
                latestTransactions.slice(0, props.count).map((txHash: string, index: number) => (
                    <div key={index}>
                        <TransactionComponentDemo transactionHash={txHash} scrape />
                    </div>
                ))}
        </div>
    )
}
