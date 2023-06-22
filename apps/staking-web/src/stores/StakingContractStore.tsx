/* eslint-disable react-hooks/rules-of-hooks */
import { useChainConfig, useChainStaking } from '@utils/staking-contract'
import { useEffect } from 'react'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import * as Sentry from '@sentry/react'

const chainStaking = useChainStaking()
const chainConfig = useChainConfig()
let configTimer: NodeJS.Timer

export const initialStakingContract = async () => {
  /* --------------------------------- States --------------------------------- */
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data } = useBalance({
    address: address,
  })

  /* --------------------------------- Methods -------------------------------- */

  const fetchValidator = async () => {
    chainStaking.fetchValidators()
  }

  const fetchConfig = async () => {
    await chainConfig.fetchChainConfig()
    if (configTimer) return clearInterval(configTimer)
    configTimer = setInterval(() => {
      chainConfig.updateChainConfig()
    }, 5000)
  }

  /* --------------------------------- Watches -------------------------------- */
  useEffect(() => {
    // prevent strict mode call useEffect twice
    let ignore = false
    fetchConfig().then(() => {
      if (ignore) return
      fetchValidator()
    })

    return () => {
      ignore = true
    }
  }, [])

  // on connected or disconnected update validators & account
  useEffect(() => {
    // update sentry.io profile
    Sentry.setUser({ id: address })
    if (address) {
      Sentry.setContext('account', {
        address,
        chain_id: chain?.id,
        balance: data,
      })
    }

    // update validator
    if (chainStaking.validators?.length) chainStaking.updateValidators()
  }, [address, chain?.id])
}
