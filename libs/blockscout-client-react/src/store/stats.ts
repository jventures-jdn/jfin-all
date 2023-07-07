import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { GlobalApis } from '../apis/global-apis'
import {
    Helper,
    HelperWebSocketBlock,
    HelperWebSocketCount,
    HelperWebSocketTransaction,
    Stats,
} from '../types'
import { useEffect } from 'react'

const key = () => `stats`

// Root hook
export function useBlockscoutStats() {
    return {
        get: _statsStoreGet,
    }
}

// Individual stats state
function _statsStoreGet() {
    _statsStoreInitial()
    return useSWR(key())
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

export async function statsWebSocketRecord(data: Helper['HelpedWebSocket']) {
    const result = Object(data)
    if (result.block_number) {
        mutate(
            key(),
            {
                data_source: 'ws',
                average_block_time: Number(result.average_block_time.split(' ')[0]) * 1000, //from ws type string
                total_blocks: result.block_number,
            },
            {
                // merge with existing data if exist
                populateCache: (data, current) => ({ ...current, ...data }),
                revalidate: false,
            },
        )
    } else if (result.count) {
        mutate(
            key(),
            {
                total_addresses: Number(String(result.count).replace(/,/g, '')),
            },
            {
                populateCache: (data, current) => ({ ...current, ...data }),
                revalidate: false,
            },
        )
    } else if (result.transaction_hash) {
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
        total_addresses: Number(item.total_addresses),
        total_blocks: Number(item.total_blocks),
        total_transactions: Number(item.total_transactions),
    } as Stats
}
