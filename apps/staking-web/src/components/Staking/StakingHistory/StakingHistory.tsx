import { CopyOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { observer } from 'mobx-react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { getCurrentEnv } from '../../../stores'
import { chainConfig, chainStaking } from '@utils/staking-contract'
import CountUpMemo from '../../Countup'
import prettyTime from 'pretty-time'
import { VALIDATOR_WALLETS } from '@/utils/const'
import defaultImage from '../../../assets/images/partners/default.png'
import { formatEther } from 'viem'
import { getNetwork } from 'wagmi/actions'
import { EXPECT_CHAIN } from '@utils/chain-config'
type StakingHistoryLog = (typeof chainStaking.myStakingHistoryLogs)[0]

const columns: ColumnProps<StakingHistoryLog>[] = [
  {
    title: 'Type',
    key: 'type',
    render: (log: StakingHistoryLog) => {
      if (log.eventName === 'Undelegated') {
        const currentBlock = Number(chainConfig.blockNumber)
        const triggerEpoch = Number(log.args.epoch)
        const endBlock = Number(chainConfig.endBlock)
        const nanosec = 10e8
        const diffEpoch = chainConfig.epoch - triggerEpoch

        // ([block สุดท้ายของ epoch] - [จำนวน block ต่อ 1 epoch หรือ 0 ถ้าผ่าน epoch ของ undelegate มาแล้ว 1]) - ([block ปัจจุบัน] + [จำนวน block ต่อ 1 epoch หรือ 0 ถ้าผ่าน epoch ของ undelegate])
        const blockRemain =
          endBlock -
          (diffEpoch >= 1 ? chainConfig.epochBlockInterval : 0) -
          currentBlock +
          (diffEpoch >= 0 ? 0 : chainConfig.epochBlockInterval)

        if (blockRemain <= 0)
          return (
            <>
              {log.eventName} <span style={{ color: 'green' }}>(Done)</span>
            </>
          )

        const blockRemainNs = blockRemain * chainConfig.blockSec * nanosec

        return (
          <>
            {log.eventName}{' '}
            <span style={{ color: 'orange' }}>
              (Ready in{' '}
              {prettyTime(blockRemainNs >= 0 ? blockRemainNs : 0, 's')})
            </span>
          </>
        )
      }

      return <>{log.eventName}</>
    },
  },
  {
    title: 'Amount',
    key: 'amount',
    render: (log: StakingHistoryLog) => {
      return (
        <CountUpMemo
          end={Number(formatEther(log.args.amount as bigint))}
          duration={1}
          decimals={5}
          enableScrollSpy
          scrollSpyOnce
        />
      )
    },
  },
  {
    key: 'validator',
    title: 'Validator',
    render: (log: StakingHistoryLog) => {
      return (
        <div className="items-center column-validator">
          <img
            src={
              VALIDATOR_WALLETS[log.args.validator as string]?.image ||
              defaultImage
            }
            alt={
              VALIDATOR_WALLETS[log.args.validator as string]?.name ||
              log.args.validator
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
              {VALIDATOR_WALLETS[log.args.validator as string]?.name ||
                log.args.validator}
            </span>
            <CopyToClipboard text={log.args.validator as string}>
              <CopyOutlined
                className="copy-clipboard"
                style={{ paddingLeft: '5px' }}
              />
            </CopyToClipboard>
          </div>
        </div>
      )
    },
  },
  {
    key: 'block',
    title: 'Block',
    render: (log: StakingHistoryLog) => {
      return (
        <a
          href={`https://exp.${
            getCurrentEnv() === 'jfin' ? '' : 'testnet.'
          }jfinchain.com/block/${Number(log.blockNumber)}/transactions`}
          target="_blank"
          rel="noreferrer"
        >
          {Number(log.blockNumber)}
        </a>
      )
    },
  },
  {
    key: 'hash',
    title: 'Hash',
    render: (log: StakingHistoryLog) => {
      return (
        <a
          href={`https://exp.${
            getCurrentEnv() === 'jfin' ? '' : 'testnet.'
          }jfinchain.com/tx/${log.transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          {[
            log.transactionHash.slice(0, 5),
            log.transactionHash.slice(-5),
          ].join('....')}
        </a>
      )
    },
  },
]

const StakingHistory = observer(({ loading }: { loading: boolean }) => {
  /* --------------------------------- States --------------------------------- */
  const { chain } = getNetwork()

  /* ---------------------------------- Doms ---------------------------------- */
  return (
    <div className="staking-history-container">
      <Table
        columns={columns}
        loading={loading}
        dataSource={
          EXPECT_CHAIN.chainId === chain?.id
            ? chainStaking.myStakingHistoryLogs
            : []
        } // check expect chain before process history, blockNumber, blockEnd etc.. that user used not match with expect chain cause prettyTime error
        pagination={{ size: 'small' }}
        scroll={{ x: true }}
        rowKey={(row) => row.transactionHash || 0}
      />
    </div>
  )
})

export default StakingHistory
