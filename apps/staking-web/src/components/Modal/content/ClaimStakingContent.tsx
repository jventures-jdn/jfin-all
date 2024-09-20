import { AlertOutlined, LoadingOutlined, WarningOutlined } from '@ant-design/icons'
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
                <div className="items-center">
                    <b>Claim</b> <JfinCoin />
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

                <div className="warning-message">
                    <WarningOutlined />
                    When you have a large number of rewards claim rewards will requires a lot of
                    gas. This may result in you not receiving the full amount of rewards, If you
                    encounter any of these events, please try several times until you have received
                    all the rewards.
                </div>

                <button
                    className="button lg w-100 m-0 ghost mt-2"
                    disabled={modalStore.isLoading}
                    type="submit"
                >
                    {modalStore.isLoading ? <LoadingOutlined spin /> : 'Claim Reward'}
                </button>
            </form>
        </div>
    )
})

export default ClaimStakingContent
