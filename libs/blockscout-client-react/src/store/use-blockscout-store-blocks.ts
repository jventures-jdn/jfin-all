import useSWR, { mutate } from 'swr'
import { GraphQLFetcher } from '../fetcher/graphql-fetcher'
import { Block } from '../types'

const key = (blockNumber: number) => `blocks/${blockNumber}`

export function useBlockscoutStoreBlocks() {
    return {
        get: blockStoreGet,
        set: blockStoreSet,
        meta: blockStoreMeta,
    }
}

export function blockStoreGet(
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

const fullBlockFetcher = (blockNumber: number) => {
    return GraphQLFetcher.fetch(
        `{block(number: ${blockNumber}) { number, minerHash, gasUsed }}`,
        response =>
            ({
                block_number: response.data.block.number,
                miner_hash: response.data.block.minerHash,
                gas_used: response.data.block.gasUsed,
                is_full_data: true,
            } as Block),
    )
}

// For updating scrape block data from Websocket
export function blockStoreSet(blockNumber: number, data: Partial<Block>) {
    mutate(key(blockNumber), data, {
        populateCache: (data, current) => ({ ...current, ...data }),
        revalidate: false,
    })
    mutate('blocks', { currentBlockNumber: blockNumber }, { revalidate: false })
}

export function blockStoreMeta() {
    return useSWR('blocks', () => {}, {
        revalidateOnMount: false,
        revalidateIfStale: false,
        revalidateOnFocus: false,
    }).data as unknown as
        | {
              currentBlockNumber: number
          }
        | undefined
}
