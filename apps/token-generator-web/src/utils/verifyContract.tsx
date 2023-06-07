import { LoggerReactContextType } from '@libs/logger-react'
import { InternalChain, getChain } from '@libs/wallet-connect-react'
import { Address } from 'wagmi'
import { getNetwork } from 'wagmi/actions'
import JSON from 'json-bigint'

export const verifyContract = async ({
    logger,
    address,
    contractName,
    args,
}: {
    logger: LoggerReactContextType
    address: Address
    contractName: string
    args: unknown[]
}) => {
    const { chain } = getNetwork()
    if (!chain) return

    // verify contract
    logger.setLoading('📝 Verifying Contract...')
    const verifyResult = await fetch(
        `/api/verify?chainName=${chain?.nativeCurrency.symbol}&address=${address}&contractName=${contractName}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(args),
        },
    )
        .then(res => res.json())
        .catch(e => {
            logger.addNewline()
            logger.addMessage(e?.details || e?.message || 'Unknown', 'error')
            logger.addNewline()
            logger.setLoading(undefined)
            return Promise.reject()
        })

    // Fail
    if (!verifyResult.success) {
        logger.addMessage('🚫 Contract Verify Failed')
        logger.addMessage(
            verifyResult.error?.details ||
                verifyResult.error?.message ||
                JSON.stringify(verifyResult.error),
            'error',
        )
        logger.addNewline()
        logger.setLoading(undefined)
        return Promise.reject()
    }

    // Success
    logger.addMessage(`🎉 Contract Verified`)
    logger.addMessage(
        <a
            href={`${getChain(chain.network as InternalChain).chainExplorer.homePage}/address/${
                verifyResult.contractAddress
            }`}
            target="_blank"
        >
            <span>
                {getChain(chain.network as InternalChain).chainExplorer.homePage}/address/
                {verifyResult.contractAddress}
            </span>
        </a>,
        'success',
    )
    logger.addNewline()
    logger.setLoading(undefined)
    return Promise.resolve(verifyResult.contractAddress)
}
