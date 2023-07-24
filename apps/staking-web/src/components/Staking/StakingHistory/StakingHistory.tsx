import { CopyOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { observer } from 'mobx-react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { getCurrentEnv } from '../../../stores'
import { chainConfig, chainStaking } from '@utils/staking-contract'
import { Event } from 'ethers'
import CountUpMemo from '../../Countup'
import prettyTime from 'pretty-time'
import { VALIDATOR_WALLETS } from '@/utils/const'
import defaultImage from '../../../assets/images/partners/default.png'
import { formatEther } from 'viem'
import { getNetwork } from 'wagmi/actions'
import { EXPECT_CHAIN } from '@utils/chain-config'
type StakingHistoryLog = (typeof chainStaking.myStakingHistoryLogs)[0]

const StakingHistory = observer(({ loading }: { loading: boolean }) => {
  /* --------------------------------- States --------------------------------- */
  const { chain } = getNetwork()
  const columns: ColumnProps<StakingHistoryLog>[] = [
    {
      title: 'Type',
      key: 'type',
      render: (log: StakingHistoryLog) => {
        if (log.eventName === 'Undelegated') {
          const undelegatedBlock =
            Number(log.blockNumber) + chainConfig.epochBlockInterval

          if (undelegatedBlock < chainConfig.blockNumber)
            return (
              <>
                {log.eventName} <span style={{ color: 'green' }}>(Done)</span>
              </>
            )

          const undelegatedBlockRemain =
            (chainConfig.endBlock -
              Number(log.blockNumber) +
              chainConfig.epochBlockInterval) *
            2 // multiple 2 cause something contract delay

          const undelegatedBlockRemainNs =
            undelegatedBlockRemain * chainConfig.blockSec * 10e8

          console.log('chainConfig.blockNumber', chainConfig.blockNumber)
          console.log(
            'chainConfig.epochBlockInterval',
            chainConfig.epochBlockInterval,
          )
          console.log('log.blockNumber', Number(log.blockNumber))
          console.log('chainConfig.endBlock', chainConfig.endBlock)
          console.log('undelegatedBlockRemain', undelegatedBlockRemain)
          console.log('undelegatedBlockRemainNs', undelegatedBlockRemainNs)

          return (
            <>
              {log.eventName}{' '}
              <span style={{ color: 'orange' }}>
                (Ready in {prettyTime(undelegatedBlockRemainNs || 0, 's')})
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
      render: (validator: Event) => {
        return (
          <a
            href={`https://exp.${
              getCurrentEnv() === 'jfin' ? '' : 'testnet.'
            }jfinchain.com/tx/${validator.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {[
              validator.transactionHash.slice(0, 5),
              validator.transactionHash.slice(-5),
            ].join('....')}
          </a>
        )
      },
    },
  ]

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
