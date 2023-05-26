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
                block_number: response.data.block.number,
                hash: response.data.block.hash,
                miner: response.data.block.minerHash,
                difficulty: response.data.block.difficulty,
                gas_used: response.data.block.gasUsed,
                gas_limit: response.data.block.gasLimit,
                // TODO: more fields?
                is_full_data: true,
            } as Block),
    )
}

export function useBlockscoutStoreBlocks() {
    return {
        get: blockStoreGet,
        meta: blockStoreMeta,
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
    mutate('blocks', { currentBlockNumber: blockNumber }, { revalidate: false })
}

function blockStoreMeta() {
    const existing = useSWR('blocks', () => {}, {
        revalidateOnMount: false,
        revalidateIfStale: false,
        revalidateOnFocus: false,
    })

    const data = existing.data as unknown as {
        currentBlockNumber?: number
    }

    // Initial Block for fast loading (currently not working)
    // if (!data && !existing.isValidating) {
    //     existing.mutate(GlobalApis.chainBlocks() as any, { revalidate: false })
    // }

    return data || {}
}
