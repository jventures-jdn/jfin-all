'use client'

import { useBlockscout } from '@libs/blockscout-client-react'
import { useParams } from 'next/navigation'

export default function TransactionPage() {
    // Hook
    const transactions = useBlockscout().transactions()

    // Get block number from url
    const { hash } = useParams()

    // Get full transaction data
    const get = transactions.get(hash, { fullData: true })

    return (
        <div>
            <pre>{JSON.stringify(get.data, null, 2)}</pre>
            {/* Loading first time */}
            {get.isLoading && <div>Loading...</div>}
            {/* Loading second time and so on e.g. fetching full data */}
            {!get.isLoading && get.isValidating && <div>Updating...</div>}
        </div>
    )
}
