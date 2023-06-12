/* ----------------------- Internal chain declearation ---------------------- */
export const internalChains: InternalChain[] = ['JFIN', 'JFINT']
export type InternalChain = 'JFIN' | 'JFINT'

/* ---------------------- Chain properties decleartion ---------------------- */

export const CHAIN_EXPLORER: {
    [key in InternalChain]: { name: string; home: string; address?: string; tx?: string }
} = {
    JFIN: { name: 'blockscout', home: 'https://exp.jfinchain.com/' },
    JFINT: { name: 'blockscout', home: 'https://exp.testnet.jfinchain.com' },
}

export const CHAIN_RPC: { [key in InternalChain]: string } = {
    JFIN: 'https://rpc.jfinchain.com',
    JFINT: 'https://rpc.testnet.jfinchain.com',
}

export const CHAIN_ID: { [key in InternalChain]: number } = {
    JFIN: 3501,
    JFINT: 3502,
}

export const CHAIN_NAME: { [key in InternalChain]: string } = {
    JFIN: 'JFIN Mainnet',
    JFINT: 'JFIN Testnet',
}

export const CHAIN_NETWORK: { [key in InternalChain]: InternalChain } = {
    JFIN: 'JFIN',
    JFINT: 'JFINT',
}

export const CHAIN_DECIMAL_UNIT: { [key in InternalChain]: number } = {
    JFIN: 18,
    JFINT: 18,
}

export const CHAIN_DECIMAL: { [key in InternalChain]: bigint } = {
    JFIN: BigInt('10') ** BigInt(CHAIN_DECIMAL_UNIT['JFIN']),
    JFINT: BigInt('10') ** BigInt(CHAIN_DECIMAL_UNIT['JFINT']),
}

export const CHAIN_GAS_PRICE: { [key in InternalChain]: bigint } = {
    JFIN: BigInt(23000000000),
    JFINT: BigInt(23000000000),
}

export const CHAIN_GAS_LIMIT: { [key in InternalChain]?: BigInt } = {
    JFIN: BigInt(15000000),
    JFINT: BigInt(7000000),
}

export const CHAIN_GAS_LIMIT_CUSTOM: { [key in InternalChain]?: any } = {
    JFIN: { claim: BigInt(25000000) },
    JFINT: { claim: BigInt(7000000) },
}
