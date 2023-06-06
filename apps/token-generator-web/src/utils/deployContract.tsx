import { LoggerReactContextType } from '@libs/logger-react'
import { getWalletClient, getPublicClient, getNetwork } from 'wagmi/actions'
import { TransactionReceipt } from 'viem'

export const logDeployData = async (
    data: Record<string, any>,
    { logger }: { logger: LoggerReactContextType },
) => {
    Object.entries(data).map(([key, value], index) => {
        logger.addMessage(
            <div>
                <span className="capitalize">{key}</span>: <span>{value.toLocaleString()}</span>
            </div>,
            'info',
        )
    })
}

export const deployContract = async ({
    logger,
    abi,
    bytecode,
    args,
}: {
    logger: LoggerReactContextType
    abi: any
    bytecode: `0x${string}`
    args: unknown[]
}) => {
    const { chain } = getNetwork()
    const walletClient = await getWalletClient({ chainId: chain?.id })
    const publicClient = await getPublicClient({ chainId: chain?.id })

    // deploy contract
    logger.setLoading('📝 Sign transaction...')
    const hash = await walletClient
        ?.deployContract({
            abi,
            bytecode,
            args,
        })
        .catch((e: { details: any; message: any }) => {
            logger.addNewline()
            logger.addMessage(e?.details || e?.message || 'Unknown', 'error')
            logger.addNewline()
            logger.setLoading(undefined)
            return Promise.reject()
        })
    if (!hash) return Promise.reject()

    // wait deploy contract
    logger.setLoading(`💫 Deploying...`)
    try {
        const transaction = await publicClient.waitForTransactionReceipt({ hash: hash || '0x' })
        logger.addNewline()
        logger.addMessage('🎉 Contract Deployed')

        logger.addMessage(
            <a
                href={`https://exp.testnet.jfinchain.com/tx/${transaction.transactionHash}`}
                target="_blank"
            >
                Hash: [{transaction.transactionHash.slice(0, 7)}...
                {transaction.transactionHash.slice(-7)}]
            </a>,
            'success',
        )
        logger.addMessage(
            <a
                href={`https://exp.testnet.jfinchain.com/address/${transaction.contractAddress}`}
                target="_blank"
            >
                Address: [{transaction.contractAddress?.slice(0, 7)}...
                {transaction.contractAddress?.slice(-7)}]
            </a>,
            'success',
        )
        logger.addMessage(`Type: ${transaction.type}`, 'success')
        logger.addMessage(`Gas Used: ${transaction.gasUsed.toLocaleString()}`, 'success')

        return transaction
    } catch (e: any) {
        logger.addNewline()
        logger.addMessage(e?.details || e?.message || 'Unknown', 'error')
        logger.setLoading(undefined)
    } finally {
        logger.addNewline()
        logger.setLoading(undefined)
    }
}
