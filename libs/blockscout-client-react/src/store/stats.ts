import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { GlobalApis } from '../apis/global-apis'
import { Stats } from '../types'
import { useEffect } from 'react'

// const key = () => `stats`
const key = (blockTotal: any) => `stats/${blockTotal}`

// Root hook
export function useBlockscoutStats() {
    return {
        get: _statsStoreGet,
        meta: _statsStoreMeta,
    }
}

// Fetch stats data from api
function _fullStatsFetcher() {
    return RESTFetcher.apiv2Get(`/stats`, item => _formatFullData(item, 'fetch'))
}
// Individual stats state
function _statsStoreGet(blockTotal?: any, options?: { scrape?: boolean }) {
    console.log(`blockTotal=> ${blockTotal}`)
    const existing = useSWR(key(blockTotal), () => _fullStatsFetcher())

    // force fetch if full data is required and not yet presented
    if (
        !options?.scrape &&
        existing.data &&
        !existing.data.is_full_data &&
        !existing.isValidating
    ) {
        // clear cache so that full block data is auto fetched
        existing.mutate(undefined, { revalidate: true, populateCache: false })
    }

    return existing
}

// Internal to update latest stats numberhelper
function _updateBlockMeta(blockTotal: any) {
    mutate('stats-meta', { cuerrentBlockTotal: blockTotal })
}

// Initial stats loading
function _statsStoreInitial() {
    //     // auto clear on unmount
    useEffect(() => {
        return statsStoreInitialClear
    }, [])

    // Fetch initial stats when mounted
    return useSWR('initial-stats', GlobalApis.stats, {
        // onSuccess: response => {
        //     // iterate through respond transactions
        //     const items = response
        //     items.forEach((item: any, index: number) => {
        //         if (index < 10) {
        //             // convert transaction data to our format
        //             const parsed = _formatFullData(item, 'init')
        //             // write individual transaction data to cache
        //             mutate(key(item.hash), parsed, { revalidate: false })
        //             // update meta e.g. latest transactions
        //             _updateTransactionMeta(item.hash)
        //         }
        //     })
        // },
        // update meta e.g. current block number
        //  _updateBlockMeta(items[0].height)
    })
}

export function statsStoreInitialClear() {
    mutate('initial-stats', undefined)
    mutate('stats-meta', undefined)
}

// Global stats state
function _statsStoreMeta() {
    // Auto fetch initial transactions
    _statsStoreInitial()
    return useSWR('stats-meta', null).data || {}
}

// Handle new scrape block data from web socket
export function statsWebSocketRecord(data: any) {
    const blockTotal = data[4].block_number
    // console.log('blockNumber', stats)
    const statsData = {
        data_source: 'ws',
        average_block_time: data[4].average_block_time,
        total_blocks: data[4].block_number,
        // สิ่งที่ขาด เอาไปเอาท่ี่ ws addresses:new_address
        // Total transactions
        // Wallet addresses
    } as Stats

    mutate(key(blockTotal), statsData, {
        // merge with existing data if exist
        populateCache: (data, current) => ({ ...current, ...data }),
        revalidate: false,
    })

    _updateBlockMeta(blockTotal)
}

// Format data from api response (both init and fetch)
function _formatFullData(item: any, from: Stats['data_source']) {
    return {
        data_source: from,
        average_block_time: item.average_block_time,
        total_addresses: item.total_addresses,
        total_blocks: item.total_blocks,
        total_transactions: item.total_transactions,
        is_full_data: true,
    } as Stats
}
