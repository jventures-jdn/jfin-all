'use client'

import { useBlockscout } from '@libs/blockscout-client-react'
import { BlocksListComponentDemo } from '../../components/block'
import { Button } from '@chakra-ui/react'

export default function BlocksPage() {
    const { list, currentBlockNumber, itemCount, isFirstPage, isLastPage, nextPage, previousPage } =
        useBlockscout().blocks().list()

    return (
        <>
            <br />
            <div>Block Number : {currentBlockNumber}</div>
            {isFirstPage && <WebSocket />}
            <div className="flex">
                <Button
                    isDisabled={isFirstPage || list?.isLoading}
                    onClick={nextPage}
                    colorScheme="teal"
                    size="xs"
                    margin="1"
                >
                    Next
                </Button>
                <Button
                    isDisabled={isLastPage || list?.isLoading}
                    onClick={previousPage}
                    colorScheme="teal"
                    size="xs"
                    margin="1"
                >
                    Previous
                </Button>
            </div>
            {list?.isLoading && <>Loading...</>}
            {!list?.isLoading && (
                <>
                    Blocks :
                    <BlocksListComponentDemo count={itemCount} blockNumber={currentBlockNumber} />
                </>
            )}
            <br />
        </>
    )
}

function WebSocket() {
    const ws = useBlockscout().webSocket({
        newBlocks: true,
    })

    return <div>WebSocket : {ws.connectionStatus}</div>
}
