import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { GlobalApis } from '../apis/global-apis'
import { Stats } from '../types'
import { useEffect } from 'react'

// const key = () => `stats`

// Root hook
export function useBlockscoutStats() {
    return {
        get: _statsStoreGet,
        // get: _fullStatsStoreGet,
    }
}

// Fetch stats data from api
function _fullStatsStoreGet() {
    return RESTFetcher.apiv2Get(`/stats`, item => _formatFullData(item, 'fetch'))
}
// Individual stats state
function _statsStoreGet() {
    // const existing = useSWR(key(), () => _fullStatsStoreGet())
    const existing = _fullStatsStoreGet()
    // force fetch if full data is required and not yet presented
    // if (
    //     !options?.scrape &&
    //     existing.data &&
    //     !existing.data.is_full_data &&
    //     !existing.isValidating
    // ) {
    //     // clear cache so that full block data is auto fetched
    //     existing.mutate(undefined, { revalidate: true, populateCache: false })
    // }
    return existing
    // return 'ddd'
}
console.log('_statsStoreGet', _statsStoreGet())
// Handle new  scrape transaction data from web socket

// Internal helper to push new transaction hash to global meta store

// Initial transactions loading
function _statsStoreInitial() {
    //     // auto clear on unmount
    useEffect(() => {
        return statsStoreInitialClear
    }, [])

    //     // Fetch initial transactions when mounted
    //     return useSWR('initial-transactions', GlobalApis.initialTransactions, {
    //         onSuccess: response => {
    //             // iterate through respond transactions
    //             const items = response
    //             items.forEach((item: any, index: number) => {
    //                 if (index < 10) {
    //                     // convert transaction data to our format
    //                     const parsed = _formatFullData(item, 'init')
    //                     // write individual transaction data to cache
    //                     mutate(key(item.hash), parsed, { revalidate: false })
    //                     // update meta e.g. latest transactions
    //                     _updateTransactionMeta(item.hash)
    //                 }
    //             })
    //         },
    //     })
}

export function statsStoreInitialClear() {
    // mutate('initial-transactions', undefined)
    // mutate('initial-stats', undefined)
    // mutate('transactions-meta', undefined)
    // mutate('stats-meta', undefined)
}

// Global stats state
function _statsStoreMeta() {
    // Auto fetch initial transactions
    _statsStoreInitial()
    return useSWR('transactions-meta', null).data || {}
}

// Format data from api response (both init and fetch)
function _formatFullData(item: any, from: Stats['data_source']) {
    return {
        // data_source: from,
        average_block_time: item.average_block_time,
        total_addresses: item.total_addresses,
        total_blocks: item.total_blocks,
        total_transactions: item.total_transactions,
        is_full_data: true,
    } as Stats
}
