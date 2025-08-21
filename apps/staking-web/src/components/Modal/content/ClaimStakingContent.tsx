import {
    AlertOutlined,
    LoadingOutlined,
    WarningOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons'
import { observer } from 'mobx-react'
import { FormEvent, useEffect, useState } from 'react'
import JfinCoin from '../../../components/JfinCoin/JfinCoin'
import { useModalStore } from '../../../stores'
import { Validator, chainStaking } from '@utils/staking-contract'
import { message } from 'antd'
import { Address } from 'wagmi'
import { BaseError } from 'viem'
import * as Sentry from '@sentry/react'

interface IClaimStakingContent {
    validator: Validator
    amount: number | null
}
const ClaimStakingContent = observer((props: IClaimStakingContent) => {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    const modalStore = useModalStore()
    const [error, setError] = useState<string>()
    const isReverted = props.amount === null

    /* -------------------------------------------------------------------------- */
    /*                                   Methods                                  */
    /* -------------------------------------------------------------------------- */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(undefined)

        try {
            modalStore.setIsLoading(true)
            await chainStaking.claimValidatorReward(props.validator.owner as Address)
            modalStore.setVisible(false)
            message.success('Claim reward was done!')
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
    useEffect(() => {
        modalStore.setIsLoading(false)
    }, [])

    /* -------------------------------------------------------------------------- */
    /*                                    DOMS                                    */
    /* -------------------------------------------------------------------------- */
    return (
        <div className="claim-staking-content">
            <form onSubmit={handleSubmit}>
                {!isReverted && (
                    <>
                        <div className="items-center">
                            <b>Amount</b> <JfinCoin />
                        </div>

                        <div className="">
                            <input
                                className="staking-input"
                                disabled
                                style={{ marginTop: '15px' }}
                                type="text"
                                value={isReverted ? 'Claim Reward' : props.amount?.toFixed(5)}
                            />
                            <div className="staking-sub-input justify-between ">
                                <span className="wallet-warning">{error}</span>
                            </div>
                        </div>
                    </>
                )}

                <div className={isReverted ? 'warning-message' : 'info-message'}>
                    {isReverted ? <WarningOutlined /> : <InfoCircleOutlined />}
                    {isReverted
                        ? `You are about to pay a significant amount of gas to continue staking with this validator. The required gas depends on the duration of inactivity and is non-refundable. The process may take several transactions to complete.`
                        : // : typeof props.amount === 'number' && props.amount < 1
                          // ? `You are only claiming a small amount of rewards. (< 1 JFIN). Be sure to check whether the gas fee is worth doing this.`
                          `Claiming a large number of rewards (or from a long duration of inactivity) may require a lot of gas, and you might not be able to claim all rewards in a single transaction. If this happens, please try multiple times until all rewards are claimed.`}
                </div>

                <button
                    className="button lg w-100 m-0 mt-2"
                    disabled={modalStore.isLoading}
                    type="submit"
                >
                    {modalStore.isLoading ? (
                        <LoadingOutlined spin />
                    ) : isReverted ? (
                        'Pay gas'
                    ) : (
                        'Claim'
                    )}
                </button>
            </form>
        </div>
    )
})

export default ClaimStakingContent
