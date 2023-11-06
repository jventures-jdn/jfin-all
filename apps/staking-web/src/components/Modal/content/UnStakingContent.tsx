import { LoadingOutlined, WarningOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { FormEvent, useEffect, useState } from 'react'
import { useModalStore } from '../../../stores'
import { message } from 'antd'
import JfinCoin from '../../JfinCoin/JfinCoin'
import { Validator, chainStaking } from '@utils/staking-contract'
import { Address } from 'wagmi'
import { EXPECT_CHAIN } from '@utils/chain-config'
import * as Sentry from '@sentry/react'
import { BaseError, formatEther } from 'viem'

interface IUnStakingContent {
    forceActionButtonsEnabled?: boolean
    validator: Validator
    amount?: number
}

const UnStakingContent = observer((props: IUnStakingContent) => {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    const modalStore = useModalStore()
    const [stakedAmount, setStakedAmount] = useState<number>()
    const [unStakingAmount, setUnStakingAmount] = useState(props.amount || 0)
    const [error, setError] = useState<string>()

    /* -------------------------------------------------------------------------- */
    /*                                   Methods                                  */
    /* -------------------------------------------------------------------------- */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(undefined)

        if (!props.forceActionButtonsEnabled) {
            if (unStakingAmount < 1) return setError('Un-Stake amount must be more 1')
            if (unStakingAmount > Number(stakedAmount))
                return setError(`Un-Stake amount must be lower or equal to ${stakedAmount}`)
        }

        try {
            modalStore.setIsLoading(true)
            await chainStaking.unstakeFromValidator(
                props.validator.owner as Address,
                unStakingAmount,
            )
            modalStore.setVisible(false)
            message.success(`Un-Stake was done!`)
        } catch (e: any) {
            const error: BaseError = e
            message.error(`${error?.cause || error?.message || 'Unknown'}`)
            Sentry.captureException(e) // throw to sentry.io
        } finally {
            modalStore.setIsLoading(false)
        }
    }

    const initial = async () => {
        modalStore.setIsLoading(true)
        const myStakingAmount = Number(
            formatEther(await chainStaking.getMyStakingAmount(props.validator.owner)),
        )
        setStakedAmount(myStakingAmount)
        modalStore.setIsLoading(false)
    }

    /* --------------------------------- Watches -------------------------------- */
    useEffect(() => {
        initial()
    }, [])

    /* -------------------------------------------------------------------------- */
    /*                                    DOMS                                    */
    /* -------------------------------------------------------------------------- */

    return (
        <div className="un-staking-content">
            <form onSubmit={handleSubmit}>
                <div className="items-center">
                    <b>Un-Staking</b> <JfinCoin />
                </div>

                <div className="">
                    <input
                        className="staking-input"
                        disabled={modalStore.isLoading}
                        onChange={e => setUnStakingAmount(+e.target.value)}
                        style={{ marginTop: '15px' }}
                        type="number"
                        value={unStakingAmount}
                    />
                    <div className="staking-sub-input justify-between ">
                        <span className="wallet-warning">{error}</span>
                        <span className="col-title">Your staked: {stakedAmount || 0}</span>
                    </div>
                </div>

                <div className="warning-message">
                    <WarningOutlined />
                    After you unstake, jfin will be sent to you in the form of rewards. which you
                    will have to wait for 1 Epoch (
                    {EXPECT_CHAIN.chainNetwork == 'JFIN' ? '1hr' : '10min'}), <br />
                    Please see the{' '}
                    <a href="/assets" target="_blank">
                        Assets
                    </a>{' '}
                    page for more details.
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

export default UnStakingContent
