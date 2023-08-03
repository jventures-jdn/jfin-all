module.exports = {
    target: {
        dev_mainnet: {
            mode: 'dev',
            network: 'mainnet',
            endpoints: 'mainnet',
        },
        dev_testnet: {
            mode: 'dev',
            network: 'testnet',
            endpoints: 'testnet',
        },
        prod_mainnet: {
            mode: 'prod',
            network: 'mainnet',
            endpoints: 'mainnet',
        },
        prod_testnet: {
            mode: 'prod',
            network: 'testnet',
            endpoints: 'testnet',
        },
    },
    endpoints: {
        mainnet: {
            graphql: 'https://exp.jfinchain.com/graphiql',
            apiv2: 'https://exp.jfinchain.com/api/v2',
            websocket: 'wss://exp.jfinchain.com/socket/websocket?locale=en&vsn=2.0.0',
        },
        testnet: {
            graphql: 'https://exp.testnet.jfinchain.com/graphiql',
            apiv2: 'https://exp.testnet.jfinchain.com/api/v2',
            websocket: 'wss://exp.testnet.jfinchain.com/socket/websocket?locale=en&vsn=2.0.0',
        },
    },
}
