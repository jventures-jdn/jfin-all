import {
  useChainAccount,
  useChainConfig,
  useChainStaking,
} from '@utils/staking-contract'
import { useEffect } from 'react'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import * as Sentry from '@sentry/react'

const chainAccount = useChainAccount()
const chainStaking = useChainStaking()
const chainConfig = useChainConfig()
let configTimer: NodeJS.Timer

const fetchAccount = async () => {
  await chainAccount.getAccount()
  await chainAccount.fetchBalance()

  if (configTimer) return clearInterval(configTimer)
  configTimer = setInterval(() => {
    chainConfig.updateChainConfig()
  }, 5000)
}

const fetchValidator = async () => {
  chainStaking.fetchValidators()
}

const fetchConfig = async () => {
  await chainConfig.fetchChainConfig()
}

const _setupChain = async () => {
  await fetchConfig()
  await Promise.all([fetchValidator(), fetchAccount()])
}

export const initialStakingContract = async () => {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data } = useBalance({
    address: address,
  })

  useEffect(() => {
    _setupChain()
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
