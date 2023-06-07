// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { GlobalConfig } from '@utils/global-config'
import hre from 'hardhat'
import { execSync } from 'child_process'
import path from 'path'
import { writeFileSync, unlinkSync } from 'fs'
import { NextResponse } from 'next/server'
import JSON from 'json-bigint'

export const config = {
    api: {
        bodyParser: false, // disable request.body
    },
}

export async function POST(request: Request) {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const chainName = searchParams.get('chainName')
    const address = searchParams.get('address')
    const contractName = searchParams.get('contractName')

    console.log('chainName', chainName)
    console.log('address', address)
    console.log('contractName', contractName)
    console.log('body', body)

    const argsFile = 'arguments.js'
    const argsPath = path.join('./', argsFile)

    try {
        // creates an argument file for use in contract verify
        writeFileSync(argsPath, `module.exports = ${JSON({ storeAsString: true }).stringify(body)}`)

        // execute verify
        const result = execSync(
            `pnpm hardhat verify --network ${chainName} ${address} --contract ${contractName} --constructor-args arguments.js`,
            { stdio: 'inherit' },
        )

        return NextResponse.json({ success: true, contractAddress: `${address}`, data: result })
    } catch (e: any) {
        return NextResponse.json({ success: false, contractAddress: ``, error: e })
    } finally {
        // remove arguments file
        unlinkSync(argsPath)
    }
}

export const dynamic = 'force-dynamic'
