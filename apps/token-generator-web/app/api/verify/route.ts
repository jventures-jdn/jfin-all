// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { GlobalConfig } from '@utils/global-config'
import hre from 'hardhat'
import { execSync } from 'child_process'
import path from 'path'
import { writeFileSync, unlinkSync } from 'fs'
import { NextResponse } from 'next/server'

// export async function GET(request: Request) {
//     const { searchParams } = new URL(request.url)
//     const chainId = searchParams.get('chainId')
//     const address = searchParams.get('address')
//     const contractName = searchParams.get('contractName')

//     return NextResponse.json({ message: 'Hello World' })
// }

export async function POST(request: Request) {
    const body = request.body
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')
    const address = searchParams.get('address')
    const contractName = searchParams.get('contractName')

    console.log(body)

    return NextResponse.json({ message: 'Hello World' })
}
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     console.log('hi')
//     res.status(200).json({ text: 'Hello' })
// const {
//     query: { chainId, address, contract },
// } = req
// const body = req.body

// console.log(body)

// await hre.run('verify:verify', {
//     address: address,
//     constructorArguments: [body],
// })
// return res.status(200).json({
//     success: true,
//     contractUrl: `${address}`,
// })
// const chain = chains.find((chain: any) => chain.chainId == chainId)
// const argsFile = 'arguments.js'
// const argsPath = path.join('./', argsFile)

// if (req.method !== 'POST') return
// if (!address) throw Error(`❗ address not provided`)
// if (!chain) throw Error(`❗ network not found for chain id ${chainId}`)

// try {
//     // Creates an argument file for use in contract verify
//     writeFileSync(argsPath, `module.exports = [${JSON.stringify(body)}]`)

//     execSync(
//         // `npx hardhat sourcify --network ${chain.id} ${address} --contract ${contract} --constructor-args arguments.js --endpoint https://trustcontract.dev/server`,
//         `npx hardhat sourcify --network jfin ${address}  --endpoint https://trustcontract.dev/server`,
//         { stdio: 'inherit' },
//     )
//     // console.log(hre.network)
//     return res.status(200).json({
//         success: true,
//         contractUrl: `${chain.explorerEndpoint}/address/${address}`,
//     })
// } catch (e) {
//     return res.status(500).json({
//         success: false,
//         contractUrl: '',
//         error: e,
//         message: `npx hardhat verify --network ${chain.id} ${address} --contract ${contract} --constructor-args ${argsFile}`,
//     })
// } finally {
//     // Remove arguments file
//     unlinkSync(argsPath)
// }
// }
