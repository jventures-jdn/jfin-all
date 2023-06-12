import { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'
import { useWalletConnectModule } from '../core'
import { Web3Modal } from '@web3modal/react'

export function WalletConnectProvider({ children }: { children: ReactNode }) {
    const isProd = process.env.PROD_MODE === '1' || process.env.PROD_MODE === 'true' || false
    const { wagmiConfig, projectId, ethereumClient } = useWalletConnectModule()
    return (
        <>
            <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
            <Web3Modal
                projectId={projectId}
                ethereumClient={ethereumClient}
                themeVariables={{
                    '--w3m-accent-color': '#ed0000',
                    '--w3m-accent-fill-color': '#fff',
                    '--w3m-background-color': ' #0b0d0f',
                }}
                chainImages={{ 3501: '/jfin-light.png', 3502: 'jfin-light.png' }}
                tokenImages={{
                    JFIN: '/jfin-light.png',
                    'JFIN Testnet': 'jfin-light.png',
                }}
                walletImages={{ join: '/jfin-light.png' }}
                mobileWallets={[
                    {
                        id: 'join',
                        name: 'Join',
                        links: {
                            native: '',
                            universal: isProd
                                ? 'https://jfinwallet.page.link'
                                : 'https://joinwalletdev.page.link',
                        },
                    },
                ]}
            />
        </>
    )
}
