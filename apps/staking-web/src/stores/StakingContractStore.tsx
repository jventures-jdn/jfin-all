/* eslint-disable react-hooks/rules-of-hooks */
import { useChainConfig, useChainStaking } from '@utils/staking-contract'
import { useEffect } from 'react'

const chainStaking = useChainStaking()
const chainConfig = useChainConfig()
let configTimer: NodeJS.Timer

export const initialStakingContract = async () => {
  /* --------------------------------- States --------------------------------- */

  /* --------------------------------- Methods -------------------------------- */

  const fetchValidator = async () => {
    chainStaking.fetchValidators()
  }

  const fetchConfig = async () => {
    await chainConfig.fetchChainConfig()
    if (configTimer) clearInterval(configTimer)
    configTimer = setInterval(() => {
      chainConfig.updateChainConfig()
    }, 3000)
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
}
