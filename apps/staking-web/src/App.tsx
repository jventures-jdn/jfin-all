import { observer } from 'mobx-react'
import Conditions from './components/Conditions'
import { Route, Routes } from 'react-router-dom'
import CookieConsent from 'react-cookie-consent'
import Footer from './components/Layout/Footer/Footer'
import BlockInfo from './components/Layout/BlockInfo/BlockInfo'
import Staking from './pages/Staking/Staking'
import Governance from './pages/Governance/Governance'
import Assets from './pages/Assets/Assets'
import { initialStakingContract } from './stores/StakingContractStore'
import * as Sentry from '@sentry/react'
import { isProd } from '.'
import SentryStore from './stores/SentryStore'

const App = observer(() => {
    /* --------------------------------- States --------------------------------- */
    initialStakingContract()
    /* ---------------------------------- Doms ---------------------------------- */
    return (
        <div className="app-container">
            <div className="body">
                <BlockInfo />
                <Routes>
                    <Route path="/" element={<Staking />}>
                        <Route path="/staking" element={<Staking />} />
                    </Route>
                    <Route path="/governance" element={<Governance />} />
                    <Route path="/assets" element={<Assets />} />
                </Routes>
            </div>
            <Footer />
            <SentryStore />

            {isProd && (
                <CookieConsent
                    overlay
                    buttonStyle={{
                        color: '#fff',
                        backgroundColor: '#3c32bb',
                        fontSize: '13px',
                        borderRadius: '30px',
                        padding: '4px 16px',
                        margin: 'auto',
                    }}
                    buttonText="ยอมรับข้อตกลง"
                    contentClasses="condition-page"
                    contentStyle={{
                        margin: '0',
                        display: 'block',
                        flex: 'none',
                    }}
                    cookieName="jfinstk"
                    expires={365}
                    location="top"
                    style={{
                        background: '#2e3338',
                        display: 'block',
                        padding: '32px',
                        maxWidth: '600px',
                        position: 'relative',
                        margin: '20px auto',
                        borderRadius: '16px',
                    }}
                >
                    <Conditions />
                </CookieConsent>
            )}
        </div>
    )
})

export default Sentry.withProfiler(App, { includeUpdates: false }) as React.FC
