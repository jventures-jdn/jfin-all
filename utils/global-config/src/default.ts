export default {
    target: {
        development: {
            mode: 'dev',
            abbrev: 'dev',
            // blockchain name e.g. jfin, ethereum, polygon
            blockchain: 'jfin',
            // blockchain network name  e.g. mainnet, testnet, goerli, mumbai
            network: 'testnet',
            deployment: 'gcloud_dev',
            database: null,
            pubsub: 'sandbox',
            kms: {
                iam: 'kms_iam_sandbox',
            },
            endpoints: 'local',
            dev: {
                iam: {
                    publicKey: '',
                    privateKey: '',
                },
            },
        },
        sandbox: {
            mode: 'sbx',
            abbrev: 'sbx',
            blockchain: 'jfin',
            network: 'testnet',
            deployment: 'gcloud_sandbox',
            database: {
                hypernft: 'hypernft_sandbox',
            },
            pubsub: 'sandbox',
            kms: {
                iam: 'kms_iam_sandbox',
            },
            endpoints: 'sandbox',
        },
        production: {
            mode: 'prod',
            abbrev: 'prod',
            blockchain: 'jfin',
            network: 'mainnet',
            deployment: 'gcloud_production',
            database: {
                hypernft: 'hypernft_production',
            },
            pubsub: 'production',
            kms: {
                iam: 'kms_iam_production',
            },
            endpoints: 'production',
        },
        jfin_production: {
            mode: 'prod',
            abbrev: 'jfnprd',
            blockchain: 'jfin',
            network: 'mainnet',
            deployment: 'gcloud_production',
        },
        jfin_production_preview: {
            mode: 'prod',
            abbrev: 'jfnprdprv',
            blockchain: 'jfin',
            network: 'mainnet',
            deployment: 'gcloud_production',
        },
    },
    deployment: {
        gcloud_production: {
            projectId: 'hyper-nft',
            region: 'asia-southeast1',
            assetBucket: 'hyper-nft',
        },
        gcloud_sandbox: {
            projectId: 'hyper-nft-sandbox',
            region: 'asia-southeast1',
            assetBucket: 'hyper-nft-sandbox',
        },
        gcloud_dev: {
            // share cloud environment with `sandbox` project
            projectId: 'hyper-nft-sandbox',
            region: 'asia-southeast1',
            // special bucket for `dev` as objects are auto deleted in 1 day
            assetBucket: 'hyper-nft-dev',
        },
    },
    pubsub: {
        sandbox: {
            dispenser_trigger: 'sbx--dispenser-trigger',
            dispenser_result: 'sbx--dispenser-result',
        },
        production: {
            dispenser_trigger: 'dispenser-trigger',
            dispenser_result: 'dispenser-result',
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
    database: {
        default: {
            dbName: '',
            connectionString: '',
        },
        hypernft_production: {},
        hypernft_sandbox: {},
    },
    iam: {
        jwt: {
            issuer: 'jdn',
            audience: 'hypernft',
            algorithm: 'RS256',
            expiresIn: 604800,
        },
        kms: {
            kms_iam_sandbox: {
                projectId: 'hyper-nft-sandbox',
                location: 'asia-southeast1',
                keyRingId: 'iam-keyring-sandbox',
                cryptoKeyId: 'jwt-sign-verify-sandbox',
                cryptoKeyVersion: 1,
            },
            kms_iam_production: {
                projectId: 'hyper-nft',
                location: 'asia-southeast1',
                keyRingId: 'hypernft',
                cryptoKeyId: 'jwt-rsa',
                cryptoKeyVersion: 1,
            },
        },
    },
    endpoints: {
        local: {
            ['iam-authentication-api']: 'http://localhost:4101',
            ['admin-management-api']: 'http://localhost:4102',
            ['app-service-api']: 'http://localhost:4103',
            ['user-service-api']: 'http://localhost:4104',
            ['public-api']: 'http://localhost:4105',
            ['internal-api']: 'http://localhost:4106',
        },
        sandbox: {
            ['iam-authentication-api']: 'https://sbx--iam-authentication-api.hypernft.dev',
            ['admin-management-api']: 'https://sbx--admin-management-api.hypernft.dev',
            ['app-service-api']: 'https://sbx--app-service-api.hypernft.dev',
            ['user-service-api']: 'https://sbx--user-service-api.hypernft.dev',
            ['public-api']: 'https://sbx--public-api.hypernft.dev',
            ['internal-api']: 'https://sbx--internal-api-gitlrsbgsq-as.a.run.app',
        },
        production: {
            ['iam-authentication-api']: 'https://iam-authentication-api.hypernft.app',
            ['admin-management-api']: 'https://admin-management-api.hypernft.app',
            ['app-service-api']: 'https://app-service-api.hypernft.app',
            ['user-service-api']: 'https://user-service-api.hypernft.app',
            ['public-api']: 'https://public-api.hypernft.app',
            ['internal-api']: 'https://internal-api-wp3s4pvtza-as.a.run.app',
        },
    },
}
