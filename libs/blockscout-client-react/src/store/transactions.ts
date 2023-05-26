import useSWR, { mutate } from 'swr'
import { GraphQLFetcher } from '../fetcher/graphql-fetcher'
import { Transaction } from '../types'

const key = (transactionHash: string) => `transactions/${transactionHash}`

const fullTransactionFetcher = (transactionHash: string) => {
    return GraphQLFetcher.query(
        `{transaction(hash: "${transactionHash}") { hash }}`,
        response =>
            ({
                hash: response.data.transaction.hash,
                // TODO: more fields?
                is_full_data: true,
            } as Transaction),
    )
}

export function useBlockscoutStoreTransactions() {
    return {
        get: transactionStoreGet,
        meta: transacitonStoreMeta,
    }
}

function transactionStoreGet(
    transactionHash: string,
    options?: {
        fullData?: boolean
    },
) {
    const existing = useSWR(key(transactionHash), () => fullTransactionFetcher(transactionHash), {
        // will not fetch when mounted but data already exist
        revalidateIfStale: false,
        // will not fetch when window focused
        revalidateOnFocus: false,
    })

    // force fetch if fullData is required and not yet presented
    if (
        options?.fullData &&
        existing.data &&
        !existing.data.is_full_data &&
        !existing.isValidating
    ) {
        existing.mutate(undefined, { revalidate: true, populateCache: false })
    }

    return existing
}

// For updating scrape transaction data from Websocket
export function transactionStoreSet(transactionHash: string, data: Partial<Transaction>) {
    mutate(key(transactionHash), data, {
        populateCache: (data, current) => ({ ...current, ...data }),
        revalidate: false,
    })

    mutate(
        'transactions',
        (existing: any) => {
            const txs = existing
                ? [transactionHash, ...existing.latestTransactions].slice(0, 100)
                : [transactionHash]
            return { latestTransactions: txs }
        },
        { revalidate: false },
    )
}

function transacitonStoreMeta() {
    const existing = useSWR('transactions', () => {}, {
        revalidateOnMount: false,
        revalidateIfStale: false,
        revalidateOnFocus: false,
    })

    const data = existing.data as unknown as {
        latestTransactions?: string[]
    }

    return data || {}
}
