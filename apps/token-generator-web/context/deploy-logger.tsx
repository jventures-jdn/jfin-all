// import { ReactNode, useEffect, useState } from 'react'
// // import { web3, TransactionReceipt } from '@utils/web3'

// export type DeployEvent = {
//     key: keyof DeployEvent
//     emoji?: string
//     status?: string
//     transactionHash?: string
//     receipt?: TransactionReceipt
// }

// export async function deploy<TArgs>({
//     provider,
//     from,
//     contract,
//     args,
//     callback,
// }: {
//     provider: any
//     from: string
//     contract: any
//     args?: TArgs
//     callback?: (data: DeployEvent) => void
// }) {
//     callback?.({ key: 'status', status: 'Launching Metamask' })
//     const _web3 = new web3(provider)
//     const _contract = new _web3.eth.Contract(contract.abi)
//     const _deploy = _contract.deploy({
//         data: contract.bytecode,
//         arguments: [args || {}],
//     })
//     return new Promise<TransactionReceipt>((resolve, reject) => {
//         _deploy
//             .send({
//                 from,
//             })
//             .on('sending', async function () {
//                 await callback?.({ key: 'status', status: 'Confirming transaction' })
//             })
//             .on('error', async function (error) {
//                 reject(error)
//             })
//             .on('transactionHash', async function (transactionHash) {
//                 await callback?.({ key: 'status', status: 'Transaction confirmed' })
//                 console.log('transactionHash', transactionHash)
//                 await callback?.({ key: 'transactionHash', transactionHash })
//                 await callback?.({
//                     key: 'status',
//                     status: 'Transaction sent, please wait...',
//                     emoji: '🌏',
//                 })
//             })
//             .on('receipt', async function (receipt) {
//                 await callback?.({ key: 'status', status: 'Success', emoji: '✅' })
//                 await callback?.({ key: 'receipt', receipt })
//                 resolve(receipt)
//             })
//     })
// }

// export function useDeployLogger() {
//     const [logs, setLogs] = useState<ReactNode[]>([])
//     const addLog = (value: any, link?: string) => {
//         if (!link) {
//             setLogs(logs => [
//                 ...logs,
//                 <div key={logs.length} style={{ marginTop: 5, marginBottom: 5 }}>
//                     {typeof value === 'string' && '>'} {value}
//                 </div>,
//             ])
//         } else {
//             setLogs(logs => [
//                 ...logs,
//                 <a
//                     href={link}
//                     target="blank"
//                     key={logs.length}
//                     style={{ marginTop: 5, marginBottom: 5 }}
//                 >
//                     {typeof value === 'string' && '>'} {value}
//                 </a>,
//             ])
//         }
//     }
//     return {
//         logs,
//         logEvent: (event: DeployEvent) => {
//             const val = (event as any)[event.key]

//             // display event key
//             if (event.key === 'status') {
//                 addLog(`${event.emoji || '🦊'} ${event.status}`)
//             } else {
//                 addLog(`[${event.key}]`)
//             }

//             // display event value
//             if (typeof val === 'object') {
//                 addLog(<pre>{JSON.stringify(val, null, 2)}</pre>)
//             } else if (event.key !== 'status') {
//                 addLog(`${val}`)
//             }
//         },
//         addLog,
//         clear: () => setLogs([]),
//         cursor: <Cursor />,
//     }
// }

// function Cursor() {
//     const [on, setOn] = useState(true)
//     const [id, setId] = useState<NodeJS.Timer>()
//     useEffect(() => {
//         const id = setInterval(() => {
//             setOn(on => !on)
//             return () => {
//                 if (id) clearInterval(id)
//             }
//         }, 500)
//         setId(id)
//     }, [])
//     return <div>{on ? '|' : ' '}</div>
// }
