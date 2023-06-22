import { VALIDATOR_WALLETS } from '@/utils/const'
import { CopyOutlined } from '@ant-design/icons'
import { EXPECT_CHAIN } from '@utils/chain-config'
import { chainGovernance } from '@utils/staking-contract'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { observer } from 'mobx-react'
import CopyToClipboard from 'react-copy-to-clipboard'
import defaultImage from '../../assets/images/partners/default.png'

type Proposal = (typeof chainGovernance.proposals)[0]
const ProposalTable = observer(({ loading }: { loading: boolean }) => {
  /* --------------------------------- States --------------------------------- */
  const columns: ColumnProps<Proposal>[] = [
    {
      title: 'Description',
      render: (proposal: Proposal) => (
        <span style={{ textTransform: 'capitalize' }}>
          {proposal.args.description}
        </span>
      ),
    },
    {
      title: 'Proposal From',
      render: (v: Proposal) => (
        <div className="items-center column-validator">
          <img
            src={
              VALIDATOR_WALLETS[v.args.proposer as string]?.image ||
              defaultImage
            }
            alt={
              VALIDATOR_WALLETS[v.args.proposer as string]?.name ||
              v.args.proposer
            }
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid red',
              marginRight: '0.5rem',
            }}
          />
          <div>
            <span>
              {VALIDATOR_WALLETS[v.args.proposer as string]?.name ||
                v.args.proposer}
            </span>
            <CopyToClipboard text={v.args.proposer as string}>
              <CopyOutlined
                className="copy-clipboard"
                style={{ paddingLeft: '5px' }}
              />
            </CopyToClipboard>
          </div>
        </div>
      ),
    },
    {
      title: 'Voting Period',
      render: (proposal: Proposal) => (
        <>
          <a
            href={`https://exp.${
              EXPECT_CHAIN.chainName === 'JFIN' ? '' : 'testnet.'
            }jfinchain.com/block/${Number(
              proposal.args.startBlock,
            )}/transactions`}
            target="_blank"
            rel="noreferrer"
          >
            {Number(proposal.args.startBlock)}
          </a>
          {` --> `}
          <a
            href={`https://exp.${
              EXPECT_CHAIN.chainName === 'JFIN' ? '' : 'testnet.'
            }jfinchain.com/block/${Number(
              proposal.args.endBlock,
            )}/transactions`}
            target="_blank"
            rel="noreferrer"
          >
            {Number(proposal.args.endBlock)}
          </a>
        </>
      ),
    },
    {
      title: 'Hash',
      render: (proposal: Proposal) => (
        <>
          <a
            href={`https://exp.${
              EXPECT_CHAIN.chainName === 'JFIN' ? '' : 'testnet.'
            }jfinchain.com/tx/${proposal.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {[
              proposal.transactionHash?.slice(0, 5),
              proposal.transactionHash?.slice(-5),
            ].join('....')}
          </a>
        </>
      ),
    },
  ]

  /* ---------------------------------- Doms ---------------------------------- */
  return (
    <div className="governance-proposal-table">
      <Table
        columns={columns}
        loading={loading}
        dataSource={chainGovernance.proposals}
        pagination={{ size: 'small' }}
        scroll={{ x: true }}
        rowKey={(row) => row.transactionHash as string}
      />
    </div>
  )
})

export default ProposalTable
