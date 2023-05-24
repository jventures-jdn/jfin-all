export default {
    target: {
        development: {
            mode: 'dev',
            abbrev: 'dev',
            blockchain: 'jfin',
            network: 'testnet',
            deployment: 'gcloud_dev',
            endpoints: 'local',
        },
        sandbox: {
            mode: 'sbx',
            abbrev: 'sbx',
            blockchain: 'jfin',
            network: 'testnet',
            deployment: 'gcloud_sandbox',
            endpoints: 'sandbox',
        },
        production: {
            mode: 'prod',
            abbrev: 'prod',
            blockchain: 'jfin',
            network: 'mainnet',
            deployment: 'gcloud_production',
            endpoints: 'production',
        },
    },
    blockchain: {
        // ----- JFIN Chain -----
        jfin: {
            mainnet: {
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
            testnet: {
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
        },
        // ----- Ethereum Chain -----
        ethereum: {
            mainnet: {},
            goerli: {},
        },
        // ----- Binance Smart Chain -----
        bsc: {
            mainnet: {
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
            testnet: {
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
        },
        // ----- Polygon Chain -----
        polygon: {
            mainnet: {},
            mumbai: {},
        },
    },
    deployment: {
        gcloud_production: {},
        gcloud_sandbox: {},
        gcloud_dev: {},
    },
    endpoints: {
        local: {},
        sandbox: {},
        production: {},
    },
}
