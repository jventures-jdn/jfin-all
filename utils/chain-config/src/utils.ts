import { Chain } from 'wagmi'
import {
    CHAIN_EXPLORER,
    CHAIN_ID,
    CHAIN_NAME,
    CHAIN_NETWORK,
    CHAIN_RPC,
    InternalChain,
    internalChains,
} from './const'
import { VALIDATOR_STATUS_ENUM, VALIDATOR_STATUS_MAPPING } from './types'

/**
 * Get chain object via giving network
 * @param chain
 * @returns
 */
export const getChain = (chain: InternalChain) => {
    return {
        chainId: CHAIN_ID[chain],
        chainNetwork: CHAIN_NETWORK[chain],
        chainName: CHAIN_NAME[chain],
        chainRpc: CHAIN_RPC[chain],
        chainExplorer: CHAIN_EXPLORER[chain],
    }
}

/**
 * Get wagmi chain config via giving network
 * @param chain InternalChain
 * @returns Chain
 */
export const getChainConfig = (chain: InternalChain): Chain => {
    return {
        id: CHAIN_ID[chain],
        name: CHAIN_NAME[chain],
        network: CHAIN_NETWORK[chain],
        nativeCurrency: {
            decimals: 18,
            name: CHAIN_NAME[chain],
            symbol: CHAIN_NETWORK[chain],
        },
        rpcUrls: {
            public: { http: [CHAIN_RPC[chain]] },
            default: { http: [CHAIN_RPC[chain]] },
        },
        blockExplorers: {
            default: {
                name: CHAIN_EXPLORER[chain].name,
                url: CHAIN_EXPLORER[chain].home,
            },
        },
    }
}

/**
 * Get all internal chain config
 * @returns Chain[]
 */
export const getChains = (): Chain[] => {
    return internalChains.map(chain => getChainConfig(chain))
}

/**
 * Get status property from giving validator status
 */
export const getValidatorStatus = (status: VALIDATOR_STATUS_ENUM) => {
    switch (status) {
        case VALIDATOR_STATUS_ENUM.NOT_FOUND:
            return { status: VALIDATOR_STATUS_MAPPING[status], color: '#2e3338' }
        case VALIDATOR_STATUS_ENUM.ACTIVE:
            return { status: VALIDATOR_STATUS_MAPPING[status], color: 'green' }
        case VALIDATOR_STATUS_ENUM.PENDING:
            return { status: VALIDATOR_STATUS_MAPPING[status], color: 'orange' }
        case VALIDATOR_STATUS_ENUM.JAILED:
            return { status: VALIDATOR_STATUS_MAPPING[status], color: 'red' }
        default:
            return { status: 'NOT_FOUND', color: '#2e3338' }
    }
}

export const EXPECT_CHAIN =
    process.env.NETWORK === 'jfintest' ? getChain('JFINT') : getChain('JFIN')
