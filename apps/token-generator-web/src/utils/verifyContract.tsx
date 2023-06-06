import { LoggerReactContextType } from '@libs/logger-react'
import { Address } from 'wagmi'
import { getNetwork } from 'wagmi/actions'

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

    console.log(args)
    // verify contract
    logger.setLoading('📝 Verify contract...')
    const verifyResult = await fetch(
        `/api/verify?chainId=${chain?.id}&address=${address}&contract=${contractName}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(args),
        },
    ).then(res => res.json())

    logger.addMessage(`🎉 Contract Verified`)
}
