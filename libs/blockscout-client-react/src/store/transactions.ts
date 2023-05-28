import useSWR, { mutate } from 'swr'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { Transaction } from '../types'
import { GlobalApis } from '../apis/global-apis'

const key = (transactionHash: string) => `transactions/${transactionHash}`

// Fetch transaction data from api
const _fullTransactionFetcher = (transactionHash: string) => {
    return RESTFetcher.apiv2Get(
        `/transactions/${transactionHash}`,
        response =>
            ({
                // Parse response from api
                data_source: 'fetch',
                hash: response.hash,
                block_number: response.block,
                // TODO: more fields
                is_full_data: true,
            } as Transaction),
    )
}

export function useBlockscoutStoreTransactions() {
    return {
        get: _transactionStoreGet,
        initial: _transactionStoreInitial,
        meta: _transacitonStoreMeta,
    }
}

function _transactionStoreGet(
    transactionHash: string,
    options?: {
        fullData?: boolean
    },
) {
    const existing = useSWR(key(transactionHash), () => _fullTransactionFetcher(transactionHash), {
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

// Handle new data from web socket
export function transactionWebSocketRecord(data: any) {
    const txHash = data[4].transaction_hash
    const parsedData = {
        data_source: 'ws',
        hash: txHash,
    }
    mutate(key(txHash), parsedData, {
        populateCache: (data, current) => ({ ...current, ...data }),
        revalidate: false,
    })
    _updateTransactionMeta(txHash)
}

// Internal helper to push new transaction hash to global meta store
function _updateTransactionMeta(newTransactionHash: string) {
    mutate(
        'transactions-meta',
        (existing: any) => {
            const txs = existing
                ? [newTransactionHash, ...existing.latestTransactions].slice(0, 100)
                : [newTransactionHash]
            return { latestTransactions: txs }
        },
        { revalidate: false },
    )
}

// Initial transactions loading
function _transactionStoreInitial() {
    return useSWR('initial-transactions', GlobalApis.initialTransactions, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        onSuccess: response => {
            const items = response
            items.forEach((item: any, index: number) => {
                if (index < 10) {
                    mutate(
                        key(item.hash),
                        {
                            data_source: 'init',
                            hash: item.hash,
                            // TODO: more fields
                            is_full_data: true,
                        } as Transaction,
                        { revalidate: false },
                    )
                    _updateTransactionMeta(item.hash)
                }
            })
        },
    })
}

// Global transactions state
function _transacitonStoreMeta() {
    return useSWR('transactions-meta', null, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
    })
}
