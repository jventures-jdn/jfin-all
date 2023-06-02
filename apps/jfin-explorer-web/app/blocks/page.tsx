'use client'

import { calculateNewBlockNumber, useBlockscout } from '@libs/blockscout-client-react'
import { BlocksListComponentDemo } from '../../components/block'
import { Button } from '@chakra-ui/react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function BlocksPage() {
    const searchParams = useSearchParams()
    const blockNumber = searchParams.get('block_number')
    const itemCount = searchParams.get('items_count') || '50'
    const { currentPageBlockNumber } = useBlockscout().blocks().meta()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const router = useRouter()
    const pathname = usePathname()
    const isPreviousPageDisabled =
        blockNumber !== null && parseInt(blockNumber) < parseInt(itemCount)

    let ws = null

    // Hook
    const blocks = useBlockscout().blocks()
    const get = blocks.getAll(blockNumber ? parseInt(blockNumber) : undefined)

    // Create Websocket Connection
    // close ws connection only when a block number is specified
    ws = useBlockscout().webSocket({
        newBlocks: true,
        closeConnection: blockNumber ? false : true,
    })

    const goToNextPage = () => {
        setPageNumber(pageNumber - 1)
        const newBlockNumber = calculateNewBlockNumber(
            currentPageBlockNumber,
            blockNumber,
            itemCount,
            1,
        )
        // if the user returns to the first page, do not include the block number parameter
        router.push(`${pathname}${pageNumber !== 2 ? `?block_number=${newBlockNumber}` : ''}`)
    }

    const goToPreviousPage = () => {
        setPageNumber(pageNumber + 1)
        const newBlockNumber = calculateNewBlockNumber(
            currentPageBlockNumber,
            blockNumber,
            itemCount,
            -1,
        )
        router.push(`${pathname}?block_number=${newBlockNumber}`)
    }

    return (
        <>
            <br />
            <div>Block Number : {blockNumber}</div>
            <div>Page Number : {pageNumber}</div>
            <div className="flex">
                <Button
                    isDisabled={pageNumber === 1}
                    onClick={goToNextPage}
                    colorScheme="teal"
                    size="xs"
                    margin="1"
                >
                    Next
                </Button>
                <Button
                    isDisabled={isPreviousPageDisabled}
                    onClick={goToPreviousPage}
                    colorScheme="teal"
                    size="xs"
                    margin="1"
                >
                    Previous
                </Button>
            </div>
            {!get.isLoading && (
                <>
                    Blocks :
                    <BlocksListComponentDemo
                        count={parseInt(itemCount)}
                        blockNumber={currentPageBlockNumber}
                    />
                </>
            )}
            <br />
        </>
    )
}
