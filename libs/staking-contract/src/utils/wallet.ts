import { EXPECT_CHAIN } from '@utils/chain-config'
import { getNetwork, switchNetwork } from 'wagmi/actions'

export const switchChainWhenIncorrectChain = async () => {
    const { chain } = getNetwork()
    if (EXPECT_CHAIN.chainId !== chain?.id) {
        switchNetwork({ chainId: EXPECT_CHAIN.chainId }).catch(e => {
            throw e
        })
    }
}
