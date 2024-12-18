import { LoadingOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { observer } from 'mobx-react'
import { FormEvent, useMemo, useState } from 'react'
import JfinCoin from '../../../components/JfinCoin/JfinCoin'
import { useModalStore } from '../../../stores'
import { Validator, chainStaking } from '@utils/staking-contract'
import { Address, useAccount, useBalance } from 'wagmi'
import { BaseError, formatEther } from 'viem'
import * as Sentry from '@sentry/react'
import { getWalletClient } from 'wagmi/dist/actions'

interface IAddStakingContent {
    validator: Validator
    amount?: number
}
const AddStakingContent = observer((props: IAddStakingContent) => {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    const { address } = useAccount()
    const fetchBalance = useBalance({ address })
    const modalStore = useModalStore()
    const [stakingAmount, setStakingAmount] = useState(props.amount || 0)
    const [error, setError] = useState<string>()
    const balance = useMemo(() => {
        if (fetchBalance.isLoading || fetchBalance.data?.value === undefined) return 0
        return Number(formatEther(fetchBalance.data.value))
    }, [fetchBalance])

    /* -------------------------------------------------------------------------- */
    /*                                   Methods                                  */
    /* -------------------------------------------------------------------------- */

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(undefined)

        if (stakingAmount < 1) return setError('Stake amount must be more 1')
        if (stakingAmount > balance) return setError(`Insufficient Balance`)

        try {
            modalStore.setIsLoading(true)
            await chainStaking.stakeToValidator(props.validator.owner as Address, stakingAmount)
            modalStore.setVisible(false)
            message.success(`Staked was done!`)
        } catch (e: any) {
            const error: BaseError = e
            message.error(`${error?.cause || error?.message || 'Unknown'}`)
            Sentry.captureException(e) // throw to sentry.io
        } finally {
            modalStore.setIsLoading(false)
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Watches                                  */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                    DOMS                                    */
    /* -------------------------------------------------------------------------- */
    return (
        <div className="add-staking-content">
            <form onSubmit={handleSubmit}>
                <div className="items-center">
                    <b>Staking</b> <JfinCoin />
                </div>

                <div className="">
                    <input
                        className="staking-input"
                        disabled={modalStore.isLoading}
                        onChange={e => setStakingAmount(+e.target.value)}
                        style={{ marginTop: '15px' }}
                        type="number"
                        value={stakingAmount}
                    />
                    <div className="staking-sub-input justify-between ">
                        <span className="wallet-warning">{error}</span>
                        <span className="col-title">
                            Your balance: <span>{balance.toFixed(5)}</span>
                        </span>
                    </div>
                </div>

                <button
                    className="button lg w-100 m-0 ghost mt-2"
                    disabled={modalStore.isLoading}
                    type="submit"
                >
                    {modalStore.isLoading ? <LoadingOutlined spin /> : 'Confirm'}
                </button>
            </form>
        </div>
    )
})

export default AddStakingContent
