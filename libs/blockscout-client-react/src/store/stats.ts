import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { GlobalApis } from '../apis/global-apis'
import { Stats, StatsAddresses, StatsBlock } from '../types'
import { useEffect } from 'react'

const key = () => `stats`

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
    const existing = useSWR(key(), () => {
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
            const items = response as Stats

            const parsed = _formatFullData(items, 'init')

            mutate(key(), parsed, { revalidate: false })
            _updateBlockMeta(Number(items.total_blocks))
        },
    })
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

export function statsWebSocketRecord(
    data: {
        count: StatsAddresses['count']
        block_number: StatsBlock['block_number']
        average_block_time: StatsBlock['average_block_time']
    }[],
) {
    if (data[4].block_number) {
        mutate(
            key(),
            {
                data_source: 'ws',
                average_block_time: !isFinite(data[4]?.average_block_time)
                    ? 3000
                    : data[4]?.average_block_time,
                total_blocks: data[4]?.block_number,
            },
            {
                // merge with existing data if exist
                populateCache: (data, current) => ({ ...current, ...data }),
                revalidate: false,
            },
        )
        _updateBlockMeta(data[4].block_number as number)
    } else if (data[4].count) {
        mutate(
            key(),
            {
                total_addresses: Number(data[4]?.count.replace(/,/g, '')),
            },
            {
                populateCache: (data, current) => ({ ...current, ...data }),

                revalidate: false,
            },
        )
    }
}

// Format data from api response (both init and fetch)
function _formatFullData(item: Stats, from: Stats['data_source']) {
    return {
        data_source: from,
        average_block_time: item.average_block_time,
        total_addresses: Number(String(item.total_addresses).replace(/,/g, '')),
        total_blocks: Number(item.total_blocks),
        total_transactions: Number(item.total_transactions),
        is_full_data: true,
    } as Stats
}
