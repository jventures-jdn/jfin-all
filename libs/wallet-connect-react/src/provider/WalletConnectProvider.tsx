import { ReactNode, useEffect, useState } from 'react'
import { WagmiConfig } from 'wagmi'
import { useWalletConnectModule } from '../core'
import { Web3Modal } from '@web3modal/react'
import { EXPECT_CHAIN, REVERSE_EXPECT_CHAIN, getChainConfig } from '@utils/chain-config'

export function WalletConnectProvider({ children }: { children: ReactNode }) {
    const isProd = process.env.PROD
    const { wagmiConfig, projectId, ethereumClient } = useWalletConnectModule()

    // useLocation some how cause wallet connect disconnect not working when change route
    const isAuto = !!window.location?.search?.includes('auto')
    const [isReady, setIsReady] = useState(false)
    const isMetamask = (window as any).ethereum

    useEffect(() => setIsReady(true), [])

    return (
        <>
            {isReady ? <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig> : undefined}
            <Web3Modal
                explorerRecommendedWalletIds={[
                    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
                    'join',
                ]}
                defaultChain={getChainConfig(
                    // if `isAuto` or `isMetamask` --> join need correct chain to login wallet connect
                    // otherwise --> metamask mobile need incorrect chain to add & change chain in the first time
                    isAuto || isMetamask
                        ? EXPECT_CHAIN.chainNetwork
                        : REVERSE_EXPECT_CHAIN.chainNetwork,
                )}
                projectId={projectId}
                ethereumClient={ethereumClient}
                themeVariables={{
                    '--w3m-accent-color': '#473ae8',
                    '--w3m-accent-fill-color': '#fff',
                    '--w3m-background-color': ' #0b0d0f',
                }}
                chainImages={{ 3501: '/jfin-light.png', 3501111: 'jfin-light.png' }}
                tokenImages={{
                    JFIN: '/jfin-light.png',
                    'JFIN Testnet': 'jfin-light.png',
                }}
                walletImages={{ join: '/joinwallet.png' }}
                mobileWallets={[
                    {
                        id: 'join',
                        name: 'Join',
                        links: {
                            native: '',
                            universal: isProd
                                ? 'https://jfinwallet.page.link/'
                                : 'https://joinwalletdev.page.link/',
                        },
                    },
                ]}
            />
        </>
    )
}
