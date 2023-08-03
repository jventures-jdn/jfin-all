import { MinusOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons'
import { Col, Row, message } from 'antd'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import { getCurrentEnv, useModalStore } from '../../../stores'
import JfinCoin from '../../JfinCoin/JfinCoin'
import AddStakingContent from '../../Modal/content/AddStakingContent'
import ClaimStakingContent from '../../Modal/content/ClaimStakingContent'
import UnStakingContent from '../../Modal/content/UnStakingContent'
import './ValidatorCollapseContent.css'
import { Validator, chainStaking } from '@utils/staking-contract'
import CountUpMemo from '../../Countup'
import { Address, useAccount } from 'wagmi'
import { BaseError, formatEther } from 'viem'
import * as Sentry from '@sentry/react'

interface IValidatorCollapseContentProps {
    validator: Validator
    forceActionButtonsEnabled?: boolean
}

const ValidatorCollapseContent = observer(
    ({ validator, forceActionButtonsEnabled }: IValidatorCollapseContentProps) => {
        /* -------------------------------------------------------------------------- */
        /*                                   States                                   */
        /* -------------------------------------------------------------------------- */
        const { isConnected } = useAccount()
        const modalStore = useModalStore()
        const [apr, setApr] = useState<number>(0)
        const [myStakingReward, setMyStakingReward] = useState(0)
        const [myStakingAmount, setMyStakingAmount] = useState(0)
        const slashesCount = Number(formatEther(validator.slashesCount))
        const commissionRate = Number(formatEther(validator.commissionRate))
        const totalDelegated = Number(formatEther(validator.totalDelegated))

        /* -------------------------------------------------------------------------- */
        /*                                   Methods                                  */
        /* -------------------------------------------------------------------------- */

        const inital = async () => {
            const _myStakingReward = await chainStaking.getMyStakingRewards(validator.address)
            const _myStakingAmount = await chainStaking.getMyStakingAmount(validator.address)
            const _apr = await chainStaking.calcValidatorApr(validator.owner)

            setMyStakingReward(Number(formatEther(_myStakingReward)))
            setMyStakingAmount(Number(formatEther(_myStakingAmount)))
            setApr(_apr)
        }

        const handleClaim = async () => {
            if (!validator) return
            modalStore.setVisible(true)
            modalStore.setIsLoading(true)
            modalStore.setTitle('Claim Reward')
            modalStore.setContent(
                <ClaimStakingContent amount={myStakingReward} validator={validator} />,
            )
            modalStore.setIsLoading(false)
        }

        const handleClaimRecovery = async () => {
            if (!validator) return
            try {
                await chainStaking.claimValidatorReward(validator.owner as Address)
                message.success('Claim reward was done!')
            } catch (e: any) {
                const error: BaseError = e
                message.error(`${error?.cause || error?.message || 'Unknown'}`)
                Sentry.captureException(e) // throw to sentry.io
            }
        }

        const handleAdd = async () => {
            if (!validator) return

            modalStore.setVisible(true)
            modalStore.setIsLoading(true)
            modalStore.setTitle('Add Staking')
            modalStore.setContent(<AddStakingContent validator={validator} />)
            modalStore.setIsLoading(false)
        }

        const handleUnStaking = async () => {
            if (!validator) return

            modalStore.setVisible(true)
            modalStore.setIsLoading(true)
            modalStore.setTitle('Un-Staking')
            modalStore.setContent(
                <UnStakingContent
                    forceActionButtonsEnabled={forceActionButtonsEnabled}
                    validator={validator}
                />,
            )
            modalStore.setIsLoading(false)
        }

        /* -------------------------------------------------------------------------- */
        /*                                   Watches                                  */
        /* -------------------------------------------------------------------------- */
        useEffect(() => {
            inital()
        }, [])

        /* -------------------------------------------------------------------------- */
        /*                                    DOMS                                    */
        /* -------------------------------------------------------------------------- */
        return (
            <div className="validator-collapse-content-container">
                <Row gutter={[24, 12]}>
                    <Col className="info" lg={5} sm={24} xs={24}>
                        <div className="validator-collapse-content-card borderless">
                            <div>
                                <div style={{ width: '100%' }}>
                                    <div>
                                        <span>Slasher: </span>
                                        <CountUpMemo end={slashesCount} decimals={2} duration={1} />
                                    </div>
                                    <div>
                                        <span>APR: </span>
                                        <CountUpMemo
                                            end={apr}
                                            decimals={2}
                                            duration={1}
                                            formattingFn={v => `${v.toFixed(2)}%`}
                                        />
                                    </div>
                                    <div>
                                        <span>Comission Rate:</span>{' '}
                                        <CountUpMemo
                                            end={commissionRate}
                                            decimals={2}
                                            duration={1}
                                        />
                                    </div>
                                    <div>
                                        <span>Total Stake: </span>
                                        <CountUpMemo
                                            end={totalDelegated}
                                            decimals={2}
                                            duration={1}
                                        />
                                    </div>
                                    <a
                                        href={
                                            validator
                                                ? `https://exp.${
                                                      getCurrentEnv() === 'jfin' ? '' : 'testnet.'
                                                  }jfinchain.com/address/${validator.owner}`
                                                : '#'
                                        }
                                        rel="noreferrer"
                                        style={{ width: '100%' }}
                                        target="_blank"
                                    >
                                        Wallet Address
                                        <WalletOutlined />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="reward" lg={9} sm={24} xs={24}>
                        <div className="validator-collapse-content-card">
                            <span className="col-title">Staking Reward</span>
                            <div>
                                {!forceActionButtonsEnabled ? (
                                    <div className="value">
                                        <CountUpMemo
                                            end={myStakingReward}
                                            decimals={5}
                                            duration={1}
                                        />
                                        <JfinCoin />
                                    </div>
                                ) : (
                                    <div>Recovery Reward</div>
                                )}

                                <button
                                    className="button secondary lg"
                                    disabled={
                                        (!isConnected || !myStakingReward) &&
                                        !forceActionButtonsEnabled
                                    }
                                    onClick={() =>
                                        forceActionButtonsEnabled
                                            ? handleClaimRecovery()
                                            : handleClaim()
                                    }
                                    type="button"
                                >
                                    Claim
                                </button>
                            </div>
                        </div>
                    </Col>
                    <Col className="staking" lg={10} sm={24} xs={24}>
                        <div className="validator-collapse-content-card">
                            <span className="col-title">Staked</span>
                            <div>
                                <div className="value">
                                    <CountUpMemo end={myStakingAmount} decimals={2} duration={1} />
                                    <JfinCoin />
                                </div>
                                <div>
                                    <div style={{ textAlign: 'right' }}>
                                        <button
                                            className="button secondary lg"
                                            disabled={
                                                !isConnected ||
                                                !!myStakingReward ||
                                                forceActionButtonsEnabled
                                            }
                                            onClick={handleAdd}
                                            type="button"
                                        >
                                            <PlusOutlined />
                                        </button>

                                        <button
                                            className="button secondary lg"
                                            disabled={
                                                !isConnected ||
                                                !!myStakingReward ||
                                                forceActionButtonsEnabled
                                            }
                                            onClick={handleUnStaking}
                                            style={{ marginLeft: '10px' }}
                                            type="button"
                                        >
                                            <MinusOutlined />
                                        </button>
                                    </div>
                                    {myStakingReward ? (
                                        <div
                                            style={{
                                                marginTop: '5px',
                                                marginLeft: '1rem',
                                                fontSize: '0.7rem',
                                                textAlign: 'right',
                                                opacity: 0.75,
                                                lineHeight: 1,
                                            }}
                                        >
                                            <span>
                                                Please claim all pending reward before staking.
                                            </span>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    },
)

export default ValidatorCollapseContent
