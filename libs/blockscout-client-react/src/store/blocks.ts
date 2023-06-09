import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { Block } from '../types'
import { GlobalApis } from '../apis/global-apis'
import { useEffect } from 'react'

const key = (blockNumber: number) => `blocks/${blockNumber}`

// Root hook
export function useBlockscoutBlocks() {
    return {
        get: _blockStoreGet,
        meta: _blockStoreMeta,
    }
}

// Fetch block data from api
const _fullBlockFetcher = (blockNumber: number) => {
    return RESTFetcher.apiv2Get(
        `/blocks/${blockNumber}`,
        // convert blcok data to our format
        item => _formatFullData(item, 'fetch'),
    )
}

// Individual block state
function _blockStoreGet(
    blockNumber: number,
    options?: {
        scrape?: boolean
    },
) {
    const existing = useSWR(key(blockNumber), () => _fullBlockFetcher(blockNumber))

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

// Internal helper to update latest block number
function _updateBlockMeta(blockNumber: number) {
    mutate('blocks-meta', { currentBlockNumber: blockNumber })
}

// Initial blocks loading
function _blockStoreInitial() {
    // auto clear on unmount
    useEffect(() => {
        return blockStoreInitialClear
    }, [])

    // Fetch initial blocks when mounted
    return useSWR('initial-blocks', GlobalApis.initialBlocks, {
        onSuccess: response => {
            const items = response
            items.forEach((item: any, index: number) => {
                if (index < 10) {
                    // convert block data to our format
                    const parsed = _formatFullData(item, 'init')
                    // write individual block data to cache
                    mutate(key(item.height), parsed, { revalidate: false })
                }
            })

            // update meta e.g. current block number
            _updateBlockMeta(items[0].height)
        },
    })
}

export function blockStoreInitialClear() {
    mutate('initial-blocks', undefined)
    mutate('blocks-meta', undefined)
}

// Global blocks state
function _blockStoreMeta() {
    // Auto fetch initial blocks
    _blockStoreInitial()
    return useSWR('blocks-meta', null).data || {}
}

// Handle new scrape block data from web socket
export function blockWebSocketRecord(data: any) {
    console.log('helper___ blockWebSocketRecord', data)
    const blockNumber = data?.block_number
    const blockData = {
        data_source: 'ws',
        block_number: data.block_number,
        miner: data.block_miner_hash,
    } as Block

    mutate(key(blockNumber), blockData, {
        // merge with existing data if exist
        populateCache: (data, current) => ({ ...current, ...data }),
        revalidate: false,
    })

    _updateBlockMeta(blockNumber)
}

// Format data from api response (both init and fetch)
function _formatFullData(item: any, from: Block['data_source']) {
    return {
        data_source: from,
        block_number: item.height,
        hash: item.hash,
        miner: item.miner.hash,
        difficulty: item.difficulty,
        gas_used: item.gas_used,
        gas_limit: item.gas_limit,
        // TODO: more fields
        is_full_data: true,
    } as Block
}
