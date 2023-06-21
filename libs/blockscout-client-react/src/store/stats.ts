import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { GlobalApis } from '../apis/global-apis'
import { HelperStats, Stats } from '../types'
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
function _statsStoreGet(options?: { initialUse?: boolean }) {
    if (options?.initialUse) {
        _statsStoreInitial()
        return useSWR(key())
    } else {
        return null
    }
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

export async function statsWebSocketRecord(data: HelperStats[]) {
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
                total_addresses: Number(String(data[4]?.count).replace(/,/g, '')),
            },
            {
                populateCache: (data, current) => ({ ...current, ...data }),
                revalidate: false,
            },
        )
    } else if (data[4].transaction_hash) {
        const { total_transactions } = await mutate('stats')
        mutate(
            key(),
            {
                total_transactions: total_transactions + 1,
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
    } as Stats
}
