import { mutate } from 'swr'
import useSWR from 'swr/immutable'
import { RESTFetcher } from '../fetcher/rest-fetcher'
import { Txs, Block } from '../types'
import { GlobalApis } from '../apis/global-apis'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const key = (blockNumber: number) => `blocks/${blockNumber}`

// Root hook
export function useBlockscoutTxs() {
    return {
        get: _blockStoreGet,
        meta: (options?: { initialFetch?: boolean }) => _blockStoreMeta(options),
        list: _txsStoreList,
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
function _updateBlockMeta(currentBlockData: {
    currentBlockNumber?: number
    currentPageBlockNumber?: number
}) {
    mutate('blocks-meta', currentBlockData, {
        // merge with existing data if exist
        populateCache: (data, current) => ({ ...current, ...data }),
        revalidate: false,
    })
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
            _updateBlockMeta({ currentBlockNumber: items[0].height })
        },
    })
}

export function blockStoreInitialClear() {
    mutate('initial-blocks', undefined)
}

// Global blocks state
function _blockStoreMeta(options?: { initialFetch?: boolean }) {
    console.log('txs__ initialFetch', options?.initialFetch)
    // Auto fetch initial blocks
    options?.initialFetch ? _blockStoreInitial() : null
    return useSWR('blocks-meta', null).data || {}
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

    _updateBlockMeta({ currentBlockNumber: blockNumber, currentPageBlockNumber: blockNumber })
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

// List txs
function _txsStoreList() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const pageParam = searchParams.get('page') || '1'
    const blockNumberParam = searchParams.get('block_number')

    const itemCount = 50
    const blockNumber = blockNumberParam ? parseInt(blockNumberParam) : undefined

    const pageIndexValidated = parseInt(pageParam) > 0 ? parseInt(pageParam) : 1
    const [pageIndex, setPageIndex] = useState<number>(pageIndexValidated)
    const prevPageIndexRef = useRef(pageIndex)
    const hasPageIndexChanged = prevPageIndexRef.current !== pageIndex
    const blockListKey = blockNumber ? `blocks-list-${blockNumber}` : 'blocks-list-latest'
    const isLastPage = blockNumber && blockNumber <= itemCount
    const isFirstPage = pageIndexValidated === 1
    const isBlockQueryZero = blockNumber === 0
    const isValidBlock = blockNumber || isBlockQueryZero ? blockNumber > 0 : true
    const isWs = isFirstPage && !blockNumber && !isBlockQueryZero

    // retrieve current block number
    const { data } = useSWR(`blocks-meta`)
    const currentPageBlockNumber = data?.currentPageBlockNumber

    // update page index when the browser's pop state event occurs
    useEffect(() => {
        const handlePopstate = () => {
            const pageParam = new URL(window.location.href).searchParams.get('page') || '1'
            prevPageIndexRef.current = parseInt(pageParam)
            setPageIndex(parseInt(pageParam))
        }

        window.addEventListener('popstate', handlePopstate)
        return () => {
            window.removeEventListener('popstate', handlePopstate)
        }
    }, [])

    useEffect(() => {
        if (pageIndex && currentPageBlockNumber && hasPageIndexChanged) {
            const magnitude = pageIndex > parseInt(pageParam) ? -1 : 1
            const newBlockNumber = (blockNumber || currentPageBlockNumber) + magnitude * itemCount
            prevPageIndexRef.current = pageIndex
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
    const existing = useSWR(blockListKey)

    // TODO: refactor useEffect
    // cannot update a component (`BlocksPage`) while rendering a different component (`BlocksPage`)
    useEffect(() => {
        if (existing.data && isValidBlock) {
            // set the current page block number
            console.log('txs__ existing', existing)
            _updateBlockMeta({ currentPageBlockNumber: existing.data.items[0].block })
        }
    }, [existing.data])

    // fetch block list when mounted
    const list = useSWR(
        blockListKey,
        // () => (isValidBlock ? GlobalApis.blocks(blockNumber) : null),
        () => (isValidBlock ? GlobalApis.blocksTxs(blockNumber) : null),
        {
            onSuccess: response => {
                const items = response
                // console.log('txs__ response', delete items.next_page_params.index)

                items.items.forEach((item: any, index: number) => {
                    // convert txs data to our format
                    const parsed = _formatFullData1(item, 'txs')

                    // write individual block data to cache
                    mutate(key(item.block), parsed, { revalidate: true })
                })

                _updateBlockMeta({ currentPageBlockNumber: items.items[0].block })
                // // avoid keeping cache on the latest block
                mutate('blocks-list-latest', undefined)
            },
        },
    )
    console.log('txs__ list', list)
    // update page index
    const nextPage = () => setPageIndex(pageIndex - 1)
    const previousPage = () => setPageIndex(pageIndex + 1)

    return {
        list,
        nextPage,
        previousPage,
        isFirstPage,
        isLastPage,
        isWs,
        isValidBlock,
        blockNumber,
        itemCount,
        pageIndex,
    }
}
function _formatFullData1(item: any, from: Block['data_source']) {
    console.log('item', item)
    return {
        data_source: from,
        block_number: item.block,
        // hash: item.hash,
        // miner: item.miner.hash,
        // difficulty: item.difficulty,
        gas_used: item.gas_used,
        gas_limit: item.gas_limit,
        // TODO: more fields
        is_full_data: true,
    } as Txs
}
