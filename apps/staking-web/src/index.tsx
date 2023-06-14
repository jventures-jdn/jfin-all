import { Provider } from 'mobx-react'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import GlobalModal from './components/Modal/GlobalModal'
import * as Sentry from '@sentry/react'
import './assets/css/index.css'
import './assets/css/button.css'
import './assets/css/helper.css'
import './assets/css/input.css'
import './assets/css/pagination.css'
import './assets/css/modal.css'

import { BrowserRouter } from 'react-router-dom'
import { WalletConnectProvider } from '@libs/wallet-connect-react'
import { createRoot } from 'react-dom/client'

export const isProd =
  process.env.PROD_MODE === '1' || process.env.PROD_MODE === 'true' || false

Sentry.init({
  dsn:
    process.env.NODE_ENV === 'production'
      ? 'https://6fdd78509c3e443f85dffd333976349e@o4505033136537600.ingest.sentry.io/4505033142108160'
      : '',
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: isProd ? 1.0 : 0.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: isProd ? 0.0 : 0.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: isProd ? 1.0 : 0.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  environment: `${process.env.NETWORK}_${
    isProd ? 'production' : 'development'
  }`,
  attachStacktrace: true,
})

const Main = () => {
  /* ---------------------------------- Doms ---------------------------------- */
  return (
    <React.StrictMode>
      <BrowserRouter>
        <WalletConnectProvider>
          <Provider>
            <GlobalModal />
            <App />
          </Provider>
        </WalletConnectProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}

createRoot(document.getElementById('root') as HTMLElement).render(<Main />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
