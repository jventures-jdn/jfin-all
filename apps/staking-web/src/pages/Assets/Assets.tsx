import {
  LoadingOutlined,
  ClockCircleOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react'
import JfinCoin from '../../components/JfinCoin/JfinCoin'
import StakingHistory from '../../components/Staking/StakingHistory/StakingHistory'
import { chainAccount, useChainStaking } from '@utils/staking-contract'
import CountUpMemo from '@/components/Countup'
import { useAccount, useNetwork } from 'wagmi'
import Validators from '@/components/Validator/Validators/Validators'
import { Link } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import './Assets.css'

const Assets = observer(() => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const { chain } = useNetwork()
  const { address } = useAccount()
  const [loading, setLoading] = useState(true)
  const chainStaking = useChainStaking()
  const isLoading =
    loading || chainStaking.isFetchingValidators || !chainStaking.isReady

  /* --------------------------------- Methods -------------------------------- */
  const initialChainAccount = async () => {
    await chainAccount.getAccount()
    await chainAccount.fetchBalance()
  }

  const initial = async () => {
    setLoading(true)
    await initialChainAccount()
    chainStaking.getMyStakingHistoryLogs()
    setLoading(false)
  }

  /* --------------------------------- Watches -------------------------------- */

  useEffect(() => {
    initial()
  }, [address, chain?.id])

  const myValidators = useMemo(() => {
    if (!chainStaking.validators) return []
    return chainStaking.validators?.filter((v) =>
      chainStaking.myValidators?.find((i) => i === v.owner),
    )
  }, [chainStaking.isReady])

  /* ---------------------------------- Doms ---------------------------------- */
  return (
    <div className="assets-container">
      <div
        className=""
        style={{
          display: 'grid',
          columnGap: '20px',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div className="content-card">
          <div className="card-title">
            <b>
              <span>Your total staking</span>
            </b>
          </div>
          <div className="card-body">
            <div
              style={{
                background: '#16191d',
                padding: '1rem',
                borderRadius: '10px',
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                height: '70px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isLoading ? (
                  <LoadingOutlined spin />
                ) : (
                  <>
                    <CountUpMemo
                      end={chainStaking.getMyTotalStake}
                      decimals={2}
                      duration={1}
                    />
                    <JfinCoin />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="content-card">
          <div className="card-title">
            <b>
              <span>Your total reward</span>
            </b>
          </div>
          <div className="card-body">
            <div
              style={{
                background: '#16191d',
                padding: '1rem',
                borderRadius: '10px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70px',
              }}
            >
              {isLoading ? (
                <LoadingOutlined spin />
              ) : (
                <>
                  <CountUpMemo
                    end={chainStaking.getMyTotalReward}
                    decimals={5}
                    duration={1}
                  />
                  <JfinCoin />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="content-card mt-2">
        <div className="card-title">
          <b>
            <WalletOutlined /> <span>Your Staking</span>
          </b>
        </div>
        <div className="card-body">
          <div>
            {!myValidators.length && (
              <div style={{ display: 'none' }}>
                <Validators validators={chainStaking.activeValidator} />
              </div>
            )}

            {!myValidators.length && !isLoading && (
              <div
                className="items-center justify-center"
                style={{ width: '100%', textAlign: 'center', height: '44px' }}
              >
                <Link to="/staking" className="button lg">
                  Start Staking
                </Link>
              </div>
            )}

            <Validators validators={myValidators} />
          </div>
        </div>
      </div>

      <div className="content-card mt-2">
        <div className="card-title">
          <b>
            <ClockCircleOutlined /> <span>History</span>
          </b>
        </div>
        <div className="card-body" id="viewpoint">
          <StakingHistory loading={isLoading} />
        </div>
      </div>
    </div>
  )
})

export default Sentry.withProfiler(Assets, { name: 'Assets Page' }) as React.FC
