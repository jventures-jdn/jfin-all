'use client'

import { calculateNewBlockNumber, useBlockscout } from '@libs/blockscout-client-react'
import { BlocksListComponentDemo } from '../../components/block'
import { Button } from '@chakra-ui/react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BlocksPage() {
    const searchParams = useSearchParams()
    const blockNumber = searchParams.get('block_number')
    const itemCount = searchParams.get('items_count') || '50'
    const page = searchParams.get('page')
    const { currentPageBlockNumber } = useBlockscout().blocks().meta()
    const [newBlockNumber, setNewBlockNumber] = useState<number>()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const router = useRouter()
    const pathname = usePathname()
    const isPreviousPageDisabled = newBlockNumber && newBlockNumber < parseInt(itemCount)

    useEffect(() => {
        setPageNumber(page ? parseInt(page) : 1)
        if (page === '1') {
            // for the browser's popstate
            setNewBlockNumber(undefined)
        }
    }, [page])

    useEffect(() => {
        if (blockNumber) {
            setNewBlockNumber(parseInt(blockNumber))
        }
    }, [blockNumber])

    useEffect(() => {
        if (pageNumber && newBlockNumber) {
            router.push(
                `${pathname}${
                    // if the user returns to the first page, do not include the block number parameter
                    newBlockNumber && pageNumber !== 1
                        ? `?block_number=${newBlockNumber}&page=${pageNumber}`
                        : '?page=1'
                }`,
            )
        }
    }, [pageNumber])

    // Hook
    const blocks = useBlockscout().blocks()
    const get = blocks.getAll(newBlockNumber)

    // Create Websocket Connection
    // close ws connection only when a block number is specified
    const ws = useBlockscout().webSocket({
        newBlocks: true,
        closeConnection: blockNumber ? false : true,
    })

    const goToNextPage = () => {
        setPageNumber(pageNumber - 1)
        setNewBlockNumber(
            calculateNewBlockNumber(currentPageBlockNumber, blockNumber, itemCount, 1),
        )
    }

    const goToPreviousPage = () => {
        setPageNumber(pageNumber + 1)
        setNewBlockNumber(
            calculateNewBlockNumber(currentPageBlockNumber, blockNumber, itemCount, -1),
        )
    }

    return (
        <>
            <br />
            <div>Block Number : {newBlockNumber}</div>
            <div>Page Number : {pageNumber}</div>
            <div>WebSocket : {ws.connectionStatus}</div>
            <div className="flex">
                <Button
                    isDisabled={pageNumber === 1 || get.isLoading}
                    onClick={goToNextPage}
                    colorScheme="teal"
                    size="xs"
                    margin="1"
                >
                    Next
                </Button>
                <Button
                    isDisabled={isPreviousPageDisabled || get.isLoading}
                    onClick={goToPreviousPage}
                    colorScheme="teal"
                    size="xs"
                    margin="1"
                >
                    Previous
                </Button>
            </div>
            {get.isLoading && <>Loading...</>}
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
