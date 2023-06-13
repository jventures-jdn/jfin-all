import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { GlobalApis } from '../apis/global-apis'
import { Stats } from '../types'
import { useEffect } from 'react'

const key = (totalBlock: any) => `stats/${totalBlock}`

let statsData: Stats

// Root hook
export function useBlockscoutStats() {
    return {
        get: _statsStoreGet,
        meta: _statsStoreMeta,
    }
}

// Fetch stats data from api
const _fullStatsFetcher = (totalBlock: number) => {
    return RESTFetcher.apiv2Get(
        `/stats/${totalBlock}`,
        // convert stats data to our format
        item => _formatFullData(item, 'fetch'),
    )
}

// Individual stats state
function _statsStoreGet(totalBlock: number, options?: { scrape?: boolean }) {
    const existing = useSWR(key(totalBlock), () => {
        if (!totalBlock) return null
        return _fullStatsFetcher(totalBlock)
    })
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
function _updateBlockMeta(totalBlock: number) {
    // const parsed = _formatFullData(items, 'ws')
    mutate('stats-meta', {
        cuerrentTotalBlock: totalBlock,
    })
}

// Initial stats loading
function _statsStoreInitial() {
    // auto clear on unmount
    useEffect(() => {
        return statsStoreInitialClear
    }, [])
    // Fetch initial stats when mounted
    return useSWR('initial-stats', GlobalApis.stats, {
        onSuccess: response => {
            const items = response

            statsData = {
                total_transactions: items.total_transactions,
            } as Stats

            const parsed = _formatFullData(items, 'init')
            mutate(
                key(Number(items.total_blocks)),
                {
                    ...parsed,
                    average_block_time: _resolveAverageฺฺBlockTime(parsed.average_block_time),
                    total_addresses: _resolveTotalAddresses(parsed.total_addresses),
                },
                { revalidate: false },
            )
            _updateBlockMeta(Number(items.total_blocks))
        },
    })
}

function _resolveAverageฺฺBlockTime(averageBlockTime: any) {
    //TODO : refactor function
    if (averageBlockTime === 3000) {
        return `3 seconds`
    }
    return averageBlockTime
}

function _resolveTotalAddresses(totalAddresses: any) {
    //TODO : refactor function
    return Intl.NumberFormat('th', { currency: 'THB' }).format(totalAddresses)
}

export function statsStoreInitialClear() {
    mutate('initial-stats', undefined)
}

// Global stats state
function _statsStoreMeta() {
    // Auto fetch initial transactions
    _statsStoreInitial()

    return useSWR('stats-meta', null).data || {}
}

export function statsWebSocketRecord(data: any) {
    if (data[4].block_number) {
        statsData = {
            data_source: 'ws',
            average_block_time: data[4]?.average_block_time,
            total_blocks: data[4]?.block_number,
            total_addresses: statsData?.total_addresses,
            total_transactions: statsData?.total_transactions,
        } as Stats

        mutate(key(data[4].block_number as number), statsData, {
            // merge with existing data if exist
            populateCache: (data, current) => ({ ...current, ...data }),
            revalidate: false,
        })

        _updateBlockMeta(data[4].block_number as number)
    } else if (data[4].count) {
        statsData = {
            data_source: 'ws',
            total_addresses: data[4]?.count,
            total_transactions: statsData?.total_transactions,
        } as Stats
    }
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
