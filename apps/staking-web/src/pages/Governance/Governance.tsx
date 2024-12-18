import ProposalTable from '@/components/Governance/ProposalTable'
import { BankOutlined } from '@ant-design/icons'
import { chainGovernance } from '@utils/staking-contract'
import { useEffect, useState } from 'react'

const Governance = () => {
    /* --------------------------------- States --------------------------------- */
    const [loading, setLoading] = useState(false)

    /* --------------------------------- Methods -------------------------------- */
    const initial = async () => {
        setLoading(true)
        await chainGovernance.getProposals()
        setLoading(false)
    }
    useEffect(() => {
        initial()
    }, [])

    /* ---------------------------------- Doms ---------------------------------- */
    return (
        <div className="governance-container mt-2" id="viewpoint">
            <div className="content-card">
                <div className="card-title">
                    <b>
                        <BankOutlined /> <span>Governance</span>
                    </b>
                </div>
                <div className="card-body">
                    <div>
                        <ProposalTable loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Governance
