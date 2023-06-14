import { observer } from 'mobx-react'
import Conditions from './components/Conditions'
import Navbar from './components/Layout/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import CookieConsent from 'react-cookie-consent'
import { useAccount, useNetwork } from 'wagmi'
import Footer from './components/Layout/Footer/Footer'
import {
  useChainAccount,
  useChainConfig,
  useChainStaking,
} from '@utils/staking-contract'
import { useEffect } from 'react'
import BlockInfo from './components/Layout/BlockInfo/BlockInfo'
import Staking from './pages/Staking/Staking'
import Governance from './pages/Governance/Governance'
import Assets from './pages/Assets/Assets'
import StakingRecovery from './pages/StakingRecovery/StakingRecovery'

const App = observer(() => {
  /* --------------------------------- States --------------------------------- */

  const chainConfig = useChainConfig()
  const chainAccount = useChainAccount()
  const chainStaking = useChainStaking()
  const { chain } = useNetwork()
  const { address } = useAccount()

  // /* --------------------------------- Methods -------------------------------- */
  const initialChainConfig = async () => {
    await chainConfig.fetchChainConfig()
    setInterval(() => {
      chainConfig.updateChainConfig()
    }, 5000)
  }

  const initialChainStaking = async () => {
    await chainStaking.fetchValidators()
  }

  const initialChainAccount = async () => {
    await chainAccount.getAccount()
    await chainAccount.fetchBalance()
  }

  // /* --------------------------------- Watches -------------------------------- */
  useEffect(() => {
    initialChainConfig()
    initialChainStaking()
    initialChainAccount()
  }, [])

  // on connected or disconnected update validators & account
  useEffect(() => {
    initialChainAccount()
    if (!chainStaking.validators?.length) return
    chainStaking.updateValidators()
  }, [address, chain?.id])

  /* ---------------------------------- Doms ---------------------------------- */
  return (
    <div className="app-container">
      <Navbar />
      <div className="body">
        <BlockInfo />
        <Routes>
          <Route path="/" element={<Staking />}>
            <Route path="/staking" element={<Staking />} />
          </Route>
          <Route path="/governance" element={<Governance />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/staking-recovery" element={<StakingRecovery />} />
        </Routes>
      </div>
      <Footer />

      {process.env.NODE_ENV === 'production' && (
        <CookieConsent
          overlay
          buttonStyle={{
            color: '#fff',
            backgroundColor: '#c60000',
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

export default App
