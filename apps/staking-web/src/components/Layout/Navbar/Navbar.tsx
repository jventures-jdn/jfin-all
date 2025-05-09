import { Link, useLocation } from 'react-router-dom'
import logo from '../../../assets/images/logo-full.svg'
import { useEffect, useMemo, useState } from 'react'
import { CloseOutlined, MenuOutlined, WarningOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { NavHashLink } from 'react-router-hash-link'
import { Web3Button, useWeb3Modal } from '@web3modal/react'
import { getCurrentEnv } from '../../../stores'
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi'
import { Progress, message } from 'antd'
import { EXPECT_CHAIN } from '@utils/chain-config'
import './Navbar.css'

const Navbar = observer(() => {
    /* --------------------------------- States --------------------------------- */
    const defaultLoadingDuration = 7000
    const { isConnected, address } = useAccount()
    const { chain } = useNetwork()
    const { switchNetwork } = useSwitchNetwork({
        chainId: EXPECT_CHAIN.chainId,
        throwForSwitchChainNotSupported: true,
        onError: err => message.error(`${err.message}`),
    })
    const balance = useBalance({ address: address, watch: true })
    const [isBurgerActive, setIsBurgerActive] = useState(false)
    const location = useLocation()
    const isAuto = !!location.search.includes('auto')
    const [loading, setLoading] = useState(false)
    const [progressStep, setProgressStep] = useState(0)
    const [progress, setProgress] = useState(0)
    const [loadingDuration, setLoadingDuration] = useState(defaultLoadingDuration)
    const [loadingText, setLoadingText] = useState('Loading...')
    const { open } = useWeb3Modal()
    const isExpectChain = chain?.id === EXPECT_CHAIN.chainId
    const isMetamask = window.ethereum

    /* --------------------------------- Methods -------------------------------- */
    const handleRoute = () => {
        setIsBurgerActive(false)
    }

    const recursiveClickAuthen = (element: HTMLElement | ShadowRoot) => {
        // handle login
        const androidButton = element?.querySelector('.w3m-slider')?.querySelector('w3m-button-big')

        const iosButton = element
            ?.querySelector('w3m-wallet-button')
            ?.shadowRoot?.querySelector('button')

        if (androidButton) {
            if (isMetamask) return iosButton?.click() // is metamask browser or extension
            return androidButton?.click() // is join
        }
        if (iosButton) {
            return iosButton?.click() // is join
        }

        // travel to children node
        if (element.hasChildNodes()) {
            const children = [...element.children]
            children.forEach(children => recursiveClickAuthen(children as HTMLElement))
        }

        // travel to shadow root
        if (element instanceof HTMLElement && element.shadowRoot) {
            recursiveClickAuthen(element.shadowRoot)
        }
    }

    const handleAutoAuthen = async () => {
        setLoading(true)
        await open()

        // modal selector
        const w3mModal = document.querySelector('w3m-modal')

        const w3mModalRouter = w3mModal?.shadowRoot?.querySelector('w3m-modal-router')

        // hidden modal
        w3mModal!.style.visibility = 'hidden'

        // wait content load
        await new Promise(resolve => setTimeout(resolve, 500))

        recursiveClickAuthen(w3mModalRouter as HTMLElement)
    }

    const resetAutoAuthen = () => {
        // wait for animation
        setTimeout(() => {
            setLoading(false)
            document.querySelector('w3m-modal')!.style.visibility = 'visible'
        }, 300)
    }

    /* --------------------------------- Watches -------------------------------- */
    // watch auto authen
    useEffect(() => {
        if (!isAuto || isConnected) return
        handleAutoAuthen()
        setProgressStep(100)
    }, [isAuto])

    useEffect(() => {
        if (loading && isConnected) {
            setLoadingText('Logged In')
            setLoadingDuration(300)
            setProgressStep(100)
        }
    }, [isConnected])

    useMemo(async () => {
        if (progress >= 100) return resetAutoAuthen()
        if (loadingDuration === defaultLoadingDuration && progress >= 85)
            setLoadingText('Please manually select wallet')
        if (progress >= progressStep) return

        await new Promise(resolve => setTimeout(resolve, loadingDuration / 100))
        setProgress(progress + 1)
    }, [progressStep, progress])

    /* ---------------------------------- Doms ---------------------------------- */

    return (
        <>
            {loading && (
                <div
                    className="shadow-loading"
                    style={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: '#16191dbf',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div>
                        <Progress
                            style={{
                                fontSize: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                            type="circle"
                            percent={progress}
                            strokeColor={{ '0%': '#3c32bb', '100%': '#2e3338' }}
                        />
                        <div style={{ textAlign: 'center', paddingTop: '10px' }}>{loadingText}</div>
                    </div>
                </div>
            )}

            <div className="navbar-container">
                <div className="navbar-wrapper">
                    <div className="navbar-brand">
                        <a href="https://jfinchain.com/">
                            <img alt="jfinchain logo" src={logo} />
                        </a>
                    </div>

                    <div className="navbar-menu">
                        <Link
                            className={`${
                                ['/', '/staking'].includes(location?.pathname) && 'active'
                            }`}
                            to={`/staking${isAuto ? '?auto=1' : ''}`}
                        >
                            Staking
                        </Link>
                        <Link
                            className={`${location?.pathname === '/governance' && 'active'}`}
                            to={`/governance${isAuto ? '?auto=1' : ''}`}
                        >
                            Governance
                        </Link>
                        <Link
                            className={`${location?.pathname === '/assets' && 'active'}`}
                            to={`/assets${isAuto ? '?auto=1' : ''}`}
                        >
                            Assets
                        </Link>
                        <span>|</span>
                        <a
                            href={`https://exp.${
                                getCurrentEnv() === 'jfin' ? '' : 'testnet.'
                            }jfinchain.com/`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            Explorer
                        </a>
                        {['jfintest', 'jfindev'].includes(getCurrentEnv() || '') && (
                            <a
                                href={`https://faucet.${
                                    getCurrentEnv() === 'jfin' ? '' : 'testnet.'
                                }jfinchain.com/`}
                                rel="noreferrer"
                                target="_blank"
                            >
                                Faucet
                            </a>
                        )}
                    </div>

                    <div className="navbar-wallet">
                        <div style={{ marginRight: 'auto' }}>
                            <div className="justify-end items-center">
                                {!isExpectChain && isConnected && (
                                    <div
                                        style={{
                                            marginRight: '1rem',
                                            color: '#fa8c16',
                                            fontSize: '13px',
                                        }}
                                    >
                                        <WarningOutlined style={{ paddingRight: '0.5rem' }} />
                                        <span>
                                            Please switch chain to{' '}
                                            <b
                                                style={{
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline',
                                                }}
                                                onClick={() =>
                                                    switchNetwork?.(EXPECT_CHAIN.chainId)
                                                }
                                            >
                                                ({EXPECT_CHAIN.chainName})
                                            </b>
                                        </span>
                                    </div>
                                )}
                                <Web3Button />
                            </div>
                        </div>
                    </div>

                    <div className={`navbar-burger ${isBurgerActive && 'active'}`}>
                        <button
                            className="burger-button"
                            onClick={() => setIsBurgerActive(!isBurgerActive)}
                            type="button"
                        >
                            {isBurgerActive ? <CloseOutlined /> : <MenuOutlined />}
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`navbar-overlay ${isBurgerActive && 'active'}`}
                style={{
                    height: isBurgerActive
                        ? getCurrentEnv() === 'jfin'
                            ? '270px'
                            : '320px'
                        : '0px',
                }}
            >
                <NavHashLink
                    className={`${['/', '/staking'].includes(location?.pathname) && 'active'}`}
                    smooth
                    onClick={handleRoute}
                    to={`/staking${isAuto ? '?auto=1' : ''}#viewpoint`}
                >
                    Staking
                </NavHashLink>
                <NavHashLink
                    smooth
                    className={`${location?.pathname === '/governance' && 'active'}`}
                    onClick={handleRoute}
                    to={`/governance${isAuto ? '?auto=1' : ''}#viewpoint`}
                >
                    Governance
                </NavHashLink>
                <NavHashLink
                    smooth
                    className={`${location?.pathname === '/assets' && 'active'}`}
                    onClick={handleRoute}
                    to={`/assets${isAuto ? '?auto=1' : ''}#viewpoint`}
                >
                    Assets
                </NavHashLink>
                <a
                    href={`https://exp.${
                        getCurrentEnv() === 'jfin' ? '' : 'testnet.'
                    }jfinchain.com/`}
                    rel="noreferrer"
                    target="_blank"
                >
                    Explorer
                </a>

                {['jfintest', 'jfindev'].includes(getCurrentEnv() || '') && (
                    <a
                        href={`https://faucet.${
                            getCurrentEnv() === 'jfin' ? '' : 'testnet.'
                        }jfinchain.com/`}
                        rel="noreferrer"
                        target="_blank"
                    >
                        Faucet
                    </a>
                )}

                <div
                    style={{
                        paddingBottom: '1rem',
                        visibility: isAuto ? 'visible' : 'visible',
                    }}
                >
                    {isConnected && isAuto ? (
                        <div>
                            Balance:{' '}
                            <b style={{ color: '#3c32bb' }}>
                                {balance.data?.formatted.slice(0, 6) || 0}
                            </b>{' '}
                            {balance.data?.symbol}
                        </div>
                    ) : (
                        <Web3Button />
                    )}
                </div>
            </div>
        </>
    )
})

export default Navbar
