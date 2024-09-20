import './Staking.css'
import ValidatorInfo from '@/components/Validator/ValidatorInfo/ValidatorInfo'
import Validators from '@/components/Validator/Validators/Validators'
import { LockOutlined } from '@ant-design/icons'
import * as Sentry from '@sentry/react'

const Staking = () => {
    /* --------------------------------- States --------------------------------- */

    /* ---------------------------------- Doms ---------------------------------- */
    return (
        <div className="staking-container" id="viewpoint">
            <div className="content-card">
                <div className="card-title">
                    <b>
                        <LockOutlined /> <span>Validators</span>
                    </b>
                </div>
                <div className="card-body">
                    <ValidatorInfo />

                    <div id="view-point1" style={{ paddingTop: '2rem' }}>
                        <Validators />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sentry.withProfiler(Staking, {
    name: 'Staking Page',
}) as React.FC