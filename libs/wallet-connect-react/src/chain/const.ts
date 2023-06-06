import { Chain } from 'viem'
import { getChain } from './method'

/* ---------------------- Contract address declearation --------------------- */
export const STAKING_ADDRESS = '0x0000000000000000000000000000000000001000'
export const SLASHING_INDICATOR_ADDRESS = '0x0000000000000000000000000000000000001001'
export const SYSTEM_REWARD_ADDRESS = '0x0000000000000000000000000000000000001002'
export const STAKING_POOL_ADDRESS = '0x0000000000000000000000000000000000007001'
export const GOVERNANCE_ADDRESS = '0x0000000000000000000000000000000000007002'
export const CHAIN_CONFIG_ADDRESS = '0x0000000000000000000000000000000000007003'
export const RUNTIME_UPGRADE_ADDRESS = '0x0000000000000000000000000000000000007004'
export const DEPLOYER_PROXY_ADDRESS = '0x0000000000000000000000000000000000007005'

/* ----------------------- Chain property declearation ---------------------- */
export const CHAIN_EXPLORER: { [key in InternalChain]: string } = {
    JFIN: 'https://exp.jfinchain.com/',
    JFINT: 'https://exp.testnet.jfinchain.com',
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
    JFIN: 'JFIN',
    JFINT: 'JFIN Testnet',
}

export const CHAIN_SYMBOL: { [key in InternalChain]: string } = {
    JFIN: 'JFIN',
    JFINT: 'JFINT',
}

export const EXPECT_CHAIN =
    process.env.REACT_APP_ENVIRONMENT === 'jfintest' ? getChain('JFINT') : getChain('JFIN')

/* ------------------------- Chain type declearation ------------------------ */
export type InternalChain = 'JFIN' | 'JFINT'
export const CHAIN_DECIMAL_UNIT = 18
export const CHAIN_DECIMAL = BigInt('10') ** BigInt(CHAIN_DECIMAL_UNIT)

/* -------------------------- Validator decleartion ------------------------- */
export const VALIDATOR_STATUS_MAPPING = {
    0: 'NOT_FOUND',
    1: 'ACTIVE',
    2: 'PENDING',
    3: 'JAILED',
}

export enum VALIDATOR_STATUS_ENUM {
    'NOT_FOUND' = 0,
    'ACTIVE' = 1,
    'PENDING' = 2,
    'JAILED' = 3,
}

export const jfin = {
    id: CHAIN_ID.JFIN,
    name: CHAIN_NAME.JFIN,
    network: CHAIN_NAME.JFIN,
    nativeCurrency: {
        decimals: CHAIN_DECIMAL_UNIT,
        name: CHAIN_NAME.JFIN,
        symbol: CHAIN_NAME.JFIN,
    },
    rpcUrls: {
        public: { http: [CHAIN_RPC.JFIN] },
        default: { http: [CHAIN_RPC.JFIN] },
    },
    blockExplorers: {
        default: {
            name: 'BlockScout',
            url: CHAIN_EXPLORER.JFIN,
        },
    },
}
export const jfint: Chain = {
    id: CHAIN_ID.JFINT,
    name: CHAIN_NAME.JFINT,
    network: CHAIN_NAME.JFINT,
    nativeCurrency: {
        decimals: CHAIN_DECIMAL_UNIT,
        name: CHAIN_NAME.JFINT,
        symbol: CHAIN_NAME.JFINT,
    },
    rpcUrls: {
        public: { http: [CHAIN_RPC.JFINT] },
        default: { http: [CHAIN_RPC.JFINT] },
    },
    blockExplorers: {
        default: {
            name: 'BlockScout',
            url: CHAIN_EXPLORER.JFINT,
        },
    },
}
