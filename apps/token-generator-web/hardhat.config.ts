import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-ethers'
import { jfin, jfint } from '@libs/wallet-connect-react/src/chain'

// Manually chains
const chains = [
    {
        id: jfin.nativeCurrency.symbol,
        chainId: jfin.id,
        chainIdHex: '0xdad',
        chainName: jfin.name,
        currencyName: jfin.name,
        currencySymbol: jfin.nativeCurrency.symbol,
        rpcEndpoint: jfin.rpcUrls.default.http[0],
        explorerEndpoint: jfin.blockExplorers?.default.url,
        apiKey: '',
        apiEndpoint: 'https://exp.jfinchain.com/api',
    },
    {
        id: jfint.nativeCurrency.symbol,
        chainId: jfint.id,
        chainIdHex: '0xdad',
        chainName: jfint.name,
        currencyName: jfint.name,
        currencySymbol: jfint.nativeCurrency.symbol,
        rpcEndpoint: jfint.rpcUrls.default.http[0],
        explorerEndpoint: jfint.blockExplorers?.default.url,
        apiKey: '',
        apiEndpoint: 'https://exp.testnet.jfinchain.com/api',
    },
]

const config: HardhatUserConfig = {
    solidity: '0.8.17',
    etherscan: {
        apiKey: chains.reduce((result: any, item: any) => {
            return { ...result, [item.id]: item?.apiKey || '_' }
        }, {}),
        customChains: chains.map((c: any) => ({
            network: c.id,
            chainId: c.chainId,
            urls: {
                apiURL: c.apiEndpoint,
                browserURL: c.explorerEndpoint,
            },
        })),
    },
    networks: chains.reduce((result: any, item: any) => {
        return { ...result, [item.id]: { url: item.rpcEndpoint } }
    }, {}),
    typechain: {
        outDir: 'src/typechain',
        target: 'ethers-v5',
        alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
        externalArtifacts: [], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
        dontOverrideCompile: false, // defaults to false
    },
}

export default config
