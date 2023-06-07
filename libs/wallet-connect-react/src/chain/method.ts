import {
    CHAIN_EXPLORER,
    CHAIN_ID,
    CHAIN_NAME,
    CHAIN_RPC,
    CHAIN_SYMBOL,
    InternalChain,
} from './const'

/**
 * Get chain explorer object via giving chain
 */
export const getChainExplorer = (chain: InternalChain) => {
    const selectExplorer = CHAIN_EXPLORER[chain]
    return {
        homePage: `${selectExplorer}`,
    }
}

/**
 * Get chain object via giving chain
 */
export const getChain = (chain: InternalChain) => {
    return {
        chainId: CHAIN_ID[chain],
        chainName: CHAIN_NAME[chain],
        chainRpc: CHAIN_RPC[chain],
        chainExplorer: getChainExplorer(chain),
        chainSymbol: CHAIN_SYMBOL[chain] as InternalChain,
    }
}
