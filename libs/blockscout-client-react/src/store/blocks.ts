import useSWR, { mutate } from 'swr'
import { GraphQLFetcher } from '../fetcher/graphql-fetcher'
import { Block } from '../types'
import { GlobalApis } from '../apis/global-apis'

const key = (blockNumber: number) => `blocks/${blockNumber}`

const fullBlockFetcher = (blockNumber: number) => {
    return GraphQLFetcher.query(
        `{block(number: ${blockNumber}) { number, hash, minerHash, difficulty, gasUsed, gasLimit }}`,
        response =>
            ({
                data_source: 'fetch',
                block_number: response.data.block.number,
                hash: response.data.block.hash,
                miner: response.data.block.minerHash,
                difficulty: response.data.block.difficulty,
                gas_used: response.data.block.gasUsed,
                gas_limit: response.data.block.gasLimit,
                // TODO: more fields
                is_full_data: true,
            } as Block),
    )
}

export function useBlockscoutStoreBlocks() {
    return {
        get: blockStoreGet,
        initial: blockStoreInitial(),
        meta: blockStoreMeta(),
    }
}

function blockStoreGet(
    blockNumber: number,
    options?: {
        fullData?: boolean
    },
) {
    const existing = useSWR(key(blockNumber), () => fullBlockFetcher(blockNumber), {
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

function blockStoreInitial() {
    return useSWR('initial-blocks', GlobalApis.initialBlocks, {
        // revalidateOnMount: false,
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
function blockStoreMeta() {
    return useSWR('blocks-meta', null, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
    })
}
