'use client'

import { useBlockscout } from '@libs/blockscout-client-react'
import { BlocksPageListComponent } from '../../components/block'
import { Button } from '@chakra-ui/react'

export default function ValidatedTransactionsPage() {
    const {
        list,
        blockNumber,
        itemCount,
        pageIndex,
        isFirstPage,
        isLastPage,
        isWs,
        isValidBlock,
        nextPage,
        previousPage,
    } = useBlockscout().blocks().list()

    return (
        <div id="blocks-page">
            <div>Validated Transactions</div>

            <br />
            <div>Page Index : {pageIndex}</div>
            <div>Block Number : {blockNumber}</div>
            {isWs && <WebSocket />}
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
            {!isValidBlock && <div>There are no blocks. </div>}
            {list?.isLoading && isValidBlock && <>Loading...</>}
            {!list?.isLoading && isValidBlock && (
                <div>
                    Blocks :
                    <BlocksPageListComponent count={itemCount} />
                </div>
            )}
            <br />
        </div>
    )
}

function WebSocket() {
    const ws = useBlockscout().webSocket({
        newBlocks: true,
    })

    return <div>WebSocket : {ws.connectionStatus}</div>
}
