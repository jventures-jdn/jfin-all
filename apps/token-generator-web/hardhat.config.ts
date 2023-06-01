import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/types'

// !Use global config to get chains
// const { GlobalConfig } = require('@utils/global-config')
// const { load } = require('@utils/global-config/index_')
// load(true)

// Manually chains
const chains = [
    {
        id: 'jfin-mainnet',
        chainId: 3501,
        chainIdHex: '0xdad',
        chainName: 'JFIN Chain',
        currencyName: 'JFIN',
        currencySymbol: 'JFIN',
        rpcEndpoint: 'https://rpc.jfinchain.com',
        explorerEndpoint: 'https://exp.jfinchain.com',
        apiKey: '',
        apiEndpoint: 'https://exp.jfinchain.com/api',
    },
    {
        id: 'jfin-testnet',
        chainId: 3502,
        chainIdHex: '0xdae',
        chainName: 'JFIN Chain Testnet',
        currencyName: 'JFIN',
        currencySymbol: 'JFIN',
        rpcEndpoint: 'https://rpc.testnet.jfinchain.com',
        explorerEndpoint: 'https://exp.testnet.jfinchain.com',
        apiKey: '',
        apiEndpoint: 'https://exp.testnet.jfinchain.com/api',
    },
    {
        id: 'bsc-mainnet',
        chainId: 56,
        chainIdHex: '0x38',
        chainName: 'Binance Smart Chain',
        currencyName: 'BNB',
        currencySymbol: 'BNB',
        rpcEndpoint: 'https://bsc-dataseed.binance.org',
        explorerEndpoint: 'https://bscscan.com',
        apiKey: '',
        apiEndpoint: 'https://api.bscscan.com',
    },
    {
        id: 'bsc-testnet',
        chainId: 97,
        chainIdHex: '0x61',
        chainName: 'Binance Smart Chain Testnet',
        currencyName: 'BNB',
        currencySymbol: 'BNB',
        rpcEndpoint: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        explorerEndpoint: 'https://testnet.bscscan.com',
        apiKey: '',
        apiEndpoint: 'https://api-testnet.bscscan.com',
    },
]

const config: HardhatUserConfig = {
    solidity: '0.8.17',
    // etherscan: {
    //     apiKey: chains.reduce((result: any, item: any) => {
    //         return { ...result, [item.id]: item?.apiKey || '_' }
    //     }, {}),
    //     customChains: chains.map((c: any) => ({
    //         network: c.id,
    //         chainId: c.chainId,
    //         urls: {
    //             apiURL: c.apiEndpoint,
    //             browserURL: c.explorerEndpoint,
    //         },
    //     })),
    // },
    networks: chains.reduce((result: any, item: any) => {
        return { ...result, [item.id]: { url: item.rpcEndpoint } }
    }, {}),
    typechain: {
        outDir: 'src/@types/typechain',
        target: 'ethers-v5',
        alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
        externalArtifacts: [], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
        dontOverrideCompile: false, // defaults to false
    },
}

export default config
