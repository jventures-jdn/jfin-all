import { Col, Collapse, CollapseProps, Row } from 'antd'
import { observer } from 'mobx-react'
import './Validators.css'
import { LoadingOutlined } from '@ant-design/icons'
import ValidatorCollapseHeader from './ValidatorCollapseHeader'
import { getCurrentEnv } from '../../../stores'
import { Validator, useChainStaking } from '@utils/staking-contract'
import ValidatorCollapseContent from './ValidatorCollapseContent'

interface IValidatorsProps {
    forceActionButtonsEnabled?: boolean
    validators?: Validator[]
}

const Validators = observer((props: IValidatorsProps) => {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    const chainStaking = useChainStaking()
    const validators = props.validators || chainStaking.activeValidator
    const loading = chainStaking.isFetchingValidators

    const ValidatorCollapseHeaderLoading = () => {
        return (
            <Row style={{ width: '100%' }}>
                <Col className="item-brand" xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div
                        className="items-center justify-center"
                        style={{ width: '100%', textAlign: 'center', height: '44px' }}
                    >
                        <LoadingOutlined spin />
                    </div>
                </Col>
            </Row>
        )
    }

    const ValidatorLoading = Array.from(Array(getCurrentEnv() === 'jfin' ? 7 : 3).keys()).map(
        (_, index) => ({
            key: `validator-${index + 1}`,
            label: <ValidatorCollapseHeaderLoading />,
        }),
    )

    const items: CollapseProps['items'] = loading
        ? ValidatorLoading
        : validators.map((validator, index) => ({
              key: `validator-${index + 1}`,
              label: (
                  <div className="validator-item">
                      <ValidatorCollapseHeader validator={validator} />
                  </div>
              ),
              children: (
                  <ValidatorCollapseContent
                      validator={validator}
                      forceActionButtonsEnabled={props.forceActionButtonsEnabled}
                  />
              ),
          }))

    return (
        <div className="validators-container">
            <div className="validators-wrapper">
                <Collapse items={items} ghost bordered={false}></Collapse>
            </div>
        </div>
    )
})

export default Validators
