import { useEffect } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import * as Sentry from '@sentry/react'
import { chainStaking } from '@utils/staking-contract'

export default function SentryStore() {
  const { chain } = useNetwork()
  const { address } = useAccount()

  // on connected or disconnected update validators & account
  useEffect(() => {
    // update sentry.io profile
    Sentry.setUser({ id: address })
    if (address) {
      Sentry.setContext('account', {
        address,
        chain_id: chain?.id,
      })
    }

    // update validator
    if (chainStaking.validators?.length) chainStaking.updateValidators()
  }, [chain?.id, address])

  return <></>
}
