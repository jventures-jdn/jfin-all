import { LoggerReactContextType } from '@libs/logger-react'
import { getWalletClient, getPublicClient, getNetwork } from 'wagmi/actions'
import { CHAIN_DECIMAL, InternalChain, getChain } from '@libs/wallet-connect-react'
import { TransactionReceipt } from 'viem' // must be import for avoid `deployContract` return type error

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
    const gasPrice = await publicClient.getGasPrice()
    const transactionFeeDecimal = 10 ** 7

    if (!chain) {
        logger.addNewline()
        logger.addMessage('Chain not found')
        logger.addNewline()
        return Promise.reject()
    }

    // deploy contract
    logger.setLoading('📝 Signing transaction...')
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

    // wait deploy contract
    logger.setLoading(`💫 Deploying...`)
    try {
        const transaction = await publicClient.waitForTransactionReceipt({ hash: hash || '0x' })
        logger.addNewline()
        logger.addMessage('🎉 Contract Deployed')

        logger.addMessage(
            <a
                href={`${getChain(chain.network as InternalChain).chainExplorer.homePage}/tx/${
                    transaction.transactionHash
                }`}
                target="_blank"
            >
                Transaction Hash: <span className="underline">[{transaction.transactionHash}]</span>
            </a>,
            'success',
        )
        logger.addMessage(
            <a
                href={`${getChain(chain.network as InternalChain).chainExplorer.homePage}/address/${
                    transaction.contractAddress
                }//read-contract`}
                target="_blank"
            >
                Contract Address: <span className="underline">[{transaction.contractAddress}]</span>
            </a>,
            'success',
        )
        logger.addMessage(`Type: ${transaction.type}`, 'success')
        logger.addMessage(
            `Transaction Fee: ${(
                Number(
                    (transaction.gasUsed * gasPrice * BigInt(transactionFeeDecimal)) /
                        CHAIN_DECIMAL,
                ) / transactionFeeDecimal
            ).toLocaleString(undefined, { minimumFractionDigits: 7 })} ${
                chain.nativeCurrency.symbol
            }`,
            'success',
        )

        console.log(transaction.gasUsed * gasPrice, CHAIN_DECIMAL)
        console.log(transaction)

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
