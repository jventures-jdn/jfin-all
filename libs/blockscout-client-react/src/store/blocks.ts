import useSWR, { mutate } from 'swr'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { Block } from '../types'
import { GlobalApis } from '../apis/global-apis'

const key = (blockNumber: number) => `blocks/${blockNumber}`

// Fetch block data from api
const _fullBlockFetcher = (blockNumber: number) => {
    return RESTFetcher.apiv2Get(
        `/blocks/${blockNumber}`,
        response =>
            ({
                // Parse response from api
                data_source: 'fetch',
                block_number: response.height,
                hash: response.hash,
                miner: response.miner.hash,
                difficulty: response.difficulty,
                gas_used: response.gas_used,
                gas_limit: response.gas_limit,
                // TODO: more fields
                is_full_data: true,
            } as Block),
    )
}

export function useBlockscoutStoreBlocks() {
    return {
        get: _blockStoreGet,
        initial: _blockStoreInitial,
        meta: _blockStoreMeta,
    }
}

function _blockStoreGet(
    blockNumber: number,
    options?: {
        fullData?: boolean
    },
) {
    const existing = useSWR(key(blockNumber), () => _fullBlockFetcher(blockNumber), {
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

// For updating scrape block data from Websocket
export function blockStoreSet(blockNumber: number, data: Partial<Block>) {
    mutate(key(blockNumber), data, {
        populateCache: (data, current) => ({ ...current, ...data }),
        revalidate: false,
    })
    mutate('blocks-meta', { currentBlockNumber: blockNumber }, { revalidate: false })
}

// Initial blocks loading
function _blockStoreInitial() {
    return useSWR('initial-blocks', GlobalApis.initialBlocks, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        onSuccess: response => {
            const items = response
            items.forEach((item: any, index: number) => {
                if (index < 10) {
                    mutate(
                        key(item.height),
                        {
                            data_source: 'init',
                            block_number: item.height,
                            hash: item.hash,
                            miner: item.miner.hash,
                            // TODO: more fields
                            is_full_data: true,
                        } as Block,
                        { revalidate: false },
                    )
                }
            })

            const recent = items[0]
            const { height: currentBlockNumber } = recent
            mutate('blocks-meta', { currentBlockNumber }, { revalidate: false })
        },
    })
}

// Global blocks state
function _blockStoreMeta() {
    return useSWR('blocks-meta', null, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
    })
}

// Handle new data from web socket
export function blockWebSocketRecord(data: any) {
    blockStoreSet(data[4].block_number, {
        data_source: 'ws',
        block_number: data[4].block_number,
        miner: data[4].block_miner_hash,
    })
}
