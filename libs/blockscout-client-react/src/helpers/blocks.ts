// calculate the new block number based on the provided item count
// item count currently supports 50 items
export function calculateNewBlockNumber(currentPageBlockNumber: any, blockNumber: string | null, itemCount: string, addition: number) {
  const currentBlockNumber = blockNumber ? parseInt(blockNumber) : currentPageBlockNumber
  return currentBlockNumber + addition * parseInt(itemCount)
}
