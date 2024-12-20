import { Provider } from 'mobx-react'
import { StrictMode } from 'react'
import App from './App'
import reportWebVitals from './reportWebVitals'
import GlobalModal from './components/Modal/GlobalModal'
import * as Sentry from '@sentry/react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { WalletConnectProvider } from '@libs/wallet-connect-react'
import { ConfigProvider, theme } from 'antd'
import './assets/css/index.css'
import './assets/css/button.css'
import './assets/css/helper.css'
import './assets/css/input.css'
import './assets/css/pagination.css'
import './assets/css/modal.css'
import Navbar from './components/Layout/Navbar/Navbar'

export const isProd = process.env.PROD
window.global ||= window

Sentry.init({
    dsn: isProd
        ? process.env.VITE_SENTRY_DNS // need to change to env
        : '',
    integrations: [
        new Sentry.Integrations.GlobalHandlers({
            onerror: false,
            onunhandledrejection: false,
        }),
    ],
    tracesSampleRate: isProd ? 0.1 : 0.0,
    replaysOnErrorSampleRate: isProd ? 1 : 0.0,
    environment: `${process.env.NETWORK}_${isProd ? 'production' : 'development'}`,
    attachStacktrace: true,
})

const Main = () => {
    return (
        <StrictMode>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                }}
            >
                <BrowserRouter>
                    <WalletConnectProvider>
                        <Provider>
                            <GlobalModal />
                            <Navbar />
                            <App />
                        </Provider>
                    </WalletConnectProvider>
                </BrowserRouter>
            </ConfigProvider>
        </StrictMode>
    )
}

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(<Main />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
