'use client'

import { useBlockscout } from '@libs/blockscout-client-react'
import { BlocksListComponent } from '../../components/block'
import { Button } from '@chakra-ui/react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BlocksPage() {
    const searchParams = useSearchParams()
    const blockNumber = searchParams.get('block_number')
    const itemCount = searchParams.get('items_count') || '50'
    const { currentPageBlockNumber } = useBlockscout().blocks().meta()
    const [currentBlockNumber, setCurrentBlockNumber] = useState<any>(blockNumber)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const router = useRouter()
    const pathname = usePathname()
    let ws = null

    useEffect(() => {
        setCurrentBlockNumber(blockNumber)
    }, [blockNumber])

    // Hook
    const blocks = useBlockscout().blocks()
    const get = blocks.getAll(currentBlockNumber)

    // Create Websocket Connection
    ws = useBlockscout().webSocket({
        newBlocks: true,
        closeConnection: currentBlockNumber ? false : true,
    })

    // Event handler for button click
    const goToNextPage = () => {
        if (currentPageBlockNumber) {
            if (pageNumber === 2) {
                setCurrentBlockNumber(undefined)
                setPageNumber(pageNumber - 1)
                return
            }

            setPageNumber(pageNumber - 1)

            const newBlockNumber = parseInt(currentPageBlockNumber) + 1 + parseInt(itemCount)
            router.push(`${pathname}?block_number=${newBlockNumber}`)
        }
    }

    const goToPreviousPage = () => {
        if (currentPageBlockNumber) {
            setPageNumber(pageNumber + 1)

            const newBlockNumber = parseInt(currentPageBlockNumber) + 1 - parseInt(itemCount)
            router.push(`${pathname}?block_number=${newBlockNumber}`)
        }
    }

    return (
        <>
            <br />
            <div>Page Number : {pageNumber}</div>
            <div>Block Number : {blockNumber}</div>
            <div>Current Page Block Number : {currentPageBlockNumber}</div>
            {/* <div>Block Number Data : {blockNumberData}</div> */}
            <div>Web Socket : {ws ? ws.connectionStatus : 'close'}</div>
            {/* <div>Is loading : {get.isLoading.toString()}</div> */}
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
                    isDisabled={parseInt(currentBlockNumber) < parseInt(itemCount)}
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
                    Blocks : <BlocksListComponent count={50} />
                </>
            )}
            <br />
        </>
    )
}
