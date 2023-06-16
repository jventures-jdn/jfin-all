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

// Individual stats state
function _statsStoreGet(totalBlock: number) {
    const existing = !totalBlock ? useSWR('initial-stats') : useSWR(key())

    return existing
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
        },
    })
}

export function statsStoreInitialClear() {
    mutate('initial-stats', undefined)
}

// Global stats state
function _statsStoreMeta() {
    // Auto fetch initial transactions
    return _statsStoreInitial()
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
                average_block_time:
                    typeof data[4]?.average_block_time == 'string'
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
