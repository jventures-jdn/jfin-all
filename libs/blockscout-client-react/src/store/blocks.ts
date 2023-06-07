import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { Block } from '../types'
import { GlobalApis } from '../apis/global-apis'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
// import { calculateNewBlockNumber } from '../helpers/blocks'

const key = (blockNumber: number) => `blocks/${blockNumber}`

// Root hook
export function useBlockscoutBlocks() {
    return {
        get: _blockStoreGet,
        list: _blockStoreList,
        meta: _blockStoreMeta,
        listMeta: _blockStoreListMeta,
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

function _updateBlockListMeta(blockNumber: number) {
    mutate('blocks-list-meta', { currentBlockNumber: blockNumber })
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

function _blockStoreListMeta() {
    return useSWR('blocks-list-meta', null).data || {}
}

// Handle new scrape block data from web socket
export function blockWebSocketRecord(data: any) {
    const blockNumber = data[4].block_number
    const blockData = {
        data_source: 'ws',
        block_number: data[4].block_number,
        miner: data[4].block_miner_hash,
    } as Block

    mutate(key(blockNumber), blockData, {
        // merge with existing data if exist
        populateCache: (data, current) => ({ ...current, ...data }),
        revalidate: false,
    })

    _updateBlockMeta(blockNumber)
    _updateBlockListMeta(blockNumber)
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

// List blocks
function _blockStoreList() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const page = searchParams.get('page') || '1'
    const blockNumberParam = searchParams.get('block_number')
    const itemCountParam = searchParams.get('items_count') || '50'
    const [pageIndex, setPageIndex] = useState<number>(parseInt(page))
    const blockNumber = blockNumberParam ? parseInt(blockNumberParam) : undefined
    const itemCount = parseInt(itemCountParam)
    const isLastPage = blockNumber && blockNumber < itemCount
    const isFirstPage = page === '1'

    // retrieve current block number
    const { data } = useSWR(`blocks-list-meta`)
    const currentBlockNumber = data?.currentBlockNumber


    useEffect(() => {
        if (pageIndex && data?.currentBlockNumber) {
            const addition = pageIndex > parseInt(page) ? -1 : 1
            const newBlockNumber = (blockNumber ? blockNumber : currentBlockNumber) + addition * 50
            router.push(
                `${pathname}${
                // if the user returns to the first page, do not include the block number parameter
                newBlockNumber && pageIndex !== 1
                    ? `?block_number=${newBlockNumber}&page=${pageIndex}`
                    : '?page=1'
                }`,
            )
        }
    }, [pageIndex])

    // retrieve existing cache
    const existing = useSWR(`blocks-${blockNumber}`)

    if (existing.data && blockNumber) {
        // set the current page block number
        mutate('blocks-list-meta', { currentBlockNumber: existing.data.items[0].height })
    }

    // fetch block list when mounted
    const list = useSWR(`blocks-${blockNumber}`, () => GlobalApis.blocks(blockNumber), {
        onSuccess: response => {
            const items = response
            items.items.forEach((item: any, index: number) => {
                if (item.height > 0) {
                    const parsed = _formatFullData(item, 'fetch')

                    // write individual block data to cache
                    mutate(key(item.height), parsed, { revalidate: true })
                }
            })
            mutate('blocks-list-meta', { currentBlockNumber: items.items[0].height })
        },
    }
    )

    // updating page index
    const nextPage = () => setPageIndex(pageIndex - 1)
    const previousPage = () => setPageIndex(pageIndex + 1)

    return { list, nextPage, previousPage, isFirstPage, isLastPage, currentBlockNumber, itemCount }
}
