import { Config, PublicClient, WebSocketPublicClient, configureChains, createConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { FallbackTransport } from 'viem'
import { QueryClient } from '@tanstack/query-core'

class WalletConnectModule {
    projectId = process.env.WALLET_CONNECT_PROJECT_ID || '2dc0abd48b692cc1375af974f7533524'
    chains = [arbitrum, mainnet, polygon]
    configureChains = configureChains(this.chains, [w3mProvider({ projectId: this.projectId })])
    wagmiConfig: Config<PublicClient<FallbackTransport>, WebSocketPublicClient> & {
        queryClient: QueryClient
    } = createConfig({
        autoConnect: true,
        connectors: w3mConnectors({
            projectId: this.projectId,
            version: 2,
            chains: this.chains,
        }),
        publicClient: this.configureChains.publicClient,
    })
    ethereumClient = new EthereumClient(this.wagmiConfig, this.chains)
}

export const useWalletConnectModule = () => new WalletConnectModule()
