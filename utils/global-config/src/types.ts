import { GlobalConfigDev } from './dev'
import GlobalConfig from './default'
export type GlobalConfigFormat = any // typeof GlobalConfig & ReturnType<typeof GlobalConfigDev.system>

// export type BlockChainConfig = {
//     chainId: number
//     chainIdHex: string
//     chainName: string
//     currencyName: string
//     currencySymbol: string
//     rpcEndpoint: string
//     explorerEndpoint: string
// }

// export type Chains = keyof typeof GlobalConfig['blockchain']
// export type BlockChainSubNetwork = Record<string, BlockChainConfig>
// export type BlockChainNetwork = { [key in Chains]: BlockChainSubNetwork }
