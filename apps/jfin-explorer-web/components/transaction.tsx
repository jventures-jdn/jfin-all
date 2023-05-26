import { useBlockscout } from '@libs/blockscout-client-react'
import Link from 'next/link'

export function TransactionComponentDemo(props: { transactionHash: string; fullData?: boolean }) {
    const { transactionHash, fullData } = props
    const tx = useBlockscout().transactions().get(transactionHash, { fullData })
    if (tx.isLoading) return <span>Loading...</span>
    return (
        <div>
            <Link href={`/tx/${transactionHash}`}>📦 {JSON.stringify(tx.data)}</Link>
        </div>
    )
}

export function TransactionsListComponentDemo(props: { count: number }) {
    const { latestTransactions } = useBlockscout().transactions().meta()
    if (!latestTransactions) return null
    return (
        <div>
            {latestTransactions.slice(0, props.count).map((txHash, index) => (
                <div key={index}>
                    <TransactionComponentDemo transactionHash={txHash} />
                </div>
            ))}
        </div>
    )
}
