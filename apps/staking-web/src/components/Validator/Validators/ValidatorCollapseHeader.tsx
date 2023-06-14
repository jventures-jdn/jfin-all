import { Col, Row, Tooltip } from 'antd'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import defaultValidatorImg from '../../../assets/images/partners/default.png'
import CopyToClipboard from 'react-copy-to-clipboard'
import {
  CopyOutlined,
  DownOutlined,
  LoadingOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { VALIDATOR_WALLETS } from '../../../utils/const'
import { Validator, chainStaking } from '@utils/staking-contract'
import { getValidatorStatus } from '@utils/chain-config'
import CountUpMemo from '../../Countup'
import { Address } from 'wagmi'
import { formatEther } from 'viem'

interface IValidatorCollapseHeader {
  validator: Validator
}

const ValidatorCollapseHeader = observer(
  ({ validator }: IValidatorCollapseHeader) => {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    const [loading, setLoading] = useState(true)
    const [apr, setApr] = useState<number>(0)
    const [myStakingReward, setMyStakingReward] = useState<number>(0)
    const [myStakingAmount, setMyStakingAmount] = useState<number>(0)

    /* -------------------------------------------------------------------------- */
    /*                                   Methods                                  */
    /* -------------------------------------------------------------------------- */

    const inital = async () => {
      try {
        setLoading(true)

        // TODO: can refactor to be reused on other component, ex. ValidatorCollapseContent
        const [_myStakingReward, _myStakingAmount, _apr] = await Promise.all([
          chainStaking.getMyStakingRewards(validator.owner),
          chainStaking.getMyStakingAmount(validator.owner),
          chainStaking.calcValidatorApr(validator.owner),
        ])

        setMyStakingReward(Number(formatEther(_myStakingReward)))
        setMyStakingAmount(Number(formatEther(_myStakingAmount)))
        setApr(_apr)
      } finally {
        setLoading(false)
      }
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
      <Row className="validator-collapse-header">
        {/* brand */}
        <Col className="item-brand" lg={5} sm={7} xs={14}>
          {/* validator brand */}
          <img
            alt={`validator ${
              VALIDATOR_WALLETS[validator.owner as Address]?.name || 'validator'
            }`}
            src={`${
              VALIDATOR_WALLETS[validator.owner as Address]?.image ||
              defaultValidatorImg
            }`}
          />

          <b>
            {/* validator name or address */}
            {VALIDATOR_WALLETS[validator.owner as Address]?.name ||
              [
                (validator.owner as Address).slice(0, 5),
                (validator.owner as Address).slice(-4),
              ].join('...')}
            <CopyToClipboard text={validator.owner as Address}>
              <CopyOutlined
                className="copy-clipboard"
                style={{ marginLeft: '5px' }}
              />
            </CopyToClipboard>

            {/* validator status */}
            <Tooltip
              placement="right"
              title={getValidatorStatus(validator.status).status}
            >
              <div
                className="brand-status"
                style={{
                  background: getValidatorStatus(validator.status).color,
                }}
              />
            </Tooltip>
          </b>
        </Col>

        {/* cert */}
        <Col className="item-cert" lg={3} sm={4} xs={8}>
          {VALIDATOR_WALLETS[validator.owner as Address]?.name && (
            <div>
              <SafetyCertificateOutlined /> <span>JFIN</span>
            </div>
          )}
        </Col>

        {/* total */}
        <Col className="item-total" lg={4}>
          <div>
            <span className="col-title">Total Stake</span>
            <div>
              {loading ? (
                <LoadingOutlined spin />
              ) : (
                <CountUpMemo
                  end={Number(formatEther(validator.totalDelegated))}
                  duration={1}
                  decimals={2}
                />
              )}
            </div>
          </div>
        </Col>

        {/* apr */}
        <Col className="item-apr" lg={4} sm={5}>
          <div>
            <span className="col-title">APR</span>
            <div>
              {loading ? (
                <LoadingOutlined spin />
              ) : apr === Infinity ? (
                '-'
              ) : (
                <CountUpMemo
                  end={apr}
                  decimals={2}
                  duration={1}
                  formattingFn={(v) => `${v.toFixed(2)}%`}
                />
              )}
            </div>
          </div>
        </Col>

        {/* my reward */}
        <Col className="item-staking" lg={3} sm={4}>
          <div>
            <span className="col-title">Reward</span>
            <div>
              {loading ? (
                <LoadingOutlined spin />
              ) : myStakingReward <= 0 ? (
                '-'
              ) : (
                <CountUpMemo end={myStakingReward} decimals={5} duration={1} />
              )}
            </div>
          </div>
        </Col>

        {/* my staking */}
        <Col className="item-staking" lg={4} sm={2}>
          <div>
            <span className="col-title">Staked</span>
            <div>
              {loading ? (
                <LoadingOutlined spin />
              ) : myStakingAmount <= 0 ? (
                '-'
              ) : (
                <CountUpMemo end={myStakingAmount} decimals={2} duration={1} />
              )}
            </div>
          </div>
        </Col>

        {/* icon */}
        <Col lg={1} sm={1} style={{ textAlign: 'right' }} xs={1}>
          <div style={{ width: '100%' }}>
            <DownOutlined />
          </div>
        </Col>
      </Row>
    )
  },
)

export default ValidatorCollapseHeader
