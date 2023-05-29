import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { Transaction } from '../types'
import { GlobalApis } from '../apis/global-apis'
import { useEffect } from 'react'

const key = (transactionHash: string) => `transactions/${transactionHash}`

// Root hook
export function useBlockscoutStoreTransactions() {
    return {
        get: _transactionStoreGet,
        initial: _transactionStoreInitial,
        meta: _transacitonStoreMeta,
    }
}

// Fetch transaction data from api
const _fullTransactionFetcher = (transactionHash: string) => {
    return RESTFetcher.apiv2Get(
        `/transactions/${transactionHash}`,
        // convert transaction data to our format
        item => _formatFullData(item, 'fetch'),
    )
}

// Individual transaction state
function _transactionStoreGet(
    transactionHash: string,
    options?: {
        scrape?: boolean
    },
) {
    const existing = useSWR(key(transactionHash), () => _fullTransactionFetcher(transactionHash))

    // force fetch if full data is required and not yet presented
    if (
        !options?.scrape &&
        existing.data &&
        !existing.data.is_full_data &&
        !existing.isValidating
    ) {
        // clear cache so that full transaction data is auto fetched
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
    mutate('transactions-meta', (existing: any) => {
        const txs = existing
            ? [newTransactionHash, ...existing.latestTransactions].slice(0, 100)
            : [newTransactionHash]
        return { latestTransactions: txs }
    })
}

// Initial transactions loading
function _transactionStoreInitial() {
    // auto clear on unmount
    useEffect(() => {
        return transactionStoreInitialClear
    }, [])

    return useSWR('initial-transactions', GlobalApis.initialTransactions, {
        onSuccess: response => {
            // iterate through respond transactions
            const items = response
            items.forEach((item: any, index: number) => {
                if (index < 10) {
                    // convert transaction data to our format
                    const parsed = _formatFullData(item, 'init')
                    // write individual transaction data to cache
                    mutate(key(item.hash), parsed, { revalidate: false })
                    // update meta e.g. latest transactions
                    _updateTransactionMeta(item.hash)
                }
            })
        },
    })
}

export function transactionStoreInitialClear() {
    mutate('initial-transactions', undefined)
    mutate('transactions-meta', undefined)
}

// Global transactions state
function _transacitonStoreMeta() {
    return useSWR('transactions-meta', null)
}

// Format data from api response (both init and fetch)
function _formatFullData(item: any, from: Transaction['data_source']) {
    return {
        data_source: from,
        hash: item.hash,
        block_number: item.block,
        // TODO: more fields
        is_full_data: true,
    } as Transaction
}
