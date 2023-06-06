'use client'

import { LoggerReact, useLoggerReact } from '@libs/logger-react'
import {
    ERC20CheckboxInput,
    ERC20RangeInput,
    ERC20TextInput,
} from '../../src/components/Form/Input'
import React, { FormEvent, useState } from 'react'
import { ERC20Generator__factory } from '../../src/typechain/factories/contracts/ERC20/ERC20Generator__factory'
import { useNetwork } from 'wagmi'
import { deployContract, logDeployData } from '../../src/utils/deployContract'
import { verifyContract } from '../../src/utils/verifyContract'

interface ERC20Form {
    symbol: string
    name: string
    initialSupply: number
    supplyCap: number
    mintable: boolean
    burnable: boolean
    pausable: boolean
}
const ERC20FormDefaultState: ERC20Form = {
    symbol: '',
    name: '',
    initialSupply: 200000,
    supplyCap: 500000,
    mintable: false,
    burnable: false,
    pausable: false,
}

export default function ERC20Page() {
    /* --------------------------------- States --------------------------------- */
    const logger = useLoggerReact()
    const { chain } = useNetwork()
    const [form, setForm] = useState(ERC20FormDefaultState)

    /* --------------------------------- Methods -------------------------------- */
    const handleDeploy = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        logger.clearMessage()
        logger.addMessage(`🗳️ Deploy : ERC20 [${chain?.name}]`)

        logDeployData(form, { logger })

        const transaction = await deployContract({
            logger,
            abi: ERC20Generator__factory.abi,
            bytecode: ERC20Generator__factory.bytecode,
            args: [
                {
                    symbol: form.symbol,
                    name: form.name,
                    initialSupply: BigInt(form.initialSupply),
                    supplyCap: BigInt(form.supplyCap),
                    mintable: form.mintable,
                    burnable: form.burnable,
                    pausable: form.pausable,
                },
            ],
        })

        if (!transaction?.contractAddress) return Promise.reject()

        await verifyContract({
            logger,
            address: transaction?.contractAddress,
            contractName: 'contracts/ERC20/ERC20Generator.sol:ERC20Generator',
            args: [
                {
                    symbol: form.symbol,
                    name: form.name,
                    initialSupply: form.initialSupply,
                    supplyCap: form.supplyCap,
                    mintable: form.mintable,
                    burnable: form.burnable,
                    pausable: form.pausable,
                },
            ],
        })
    }

    /* --------------------------------- Watches -------------------------------- */

    /* ---------------------------------- Doms ---------------------------------- */
    const ERC20Form = (
        <form className="p-5 h-full" onSubmit={handleDeploy}>
            <ERC20TextInput
                options={{
                    key: 'symbol',
                    title: 'Symbol',
                    tooltip: 'Token Symbol',
                    setter: setForm,
                    value: form.symbol,
                }}
            />

            <ERC20TextInput
                options={{
                    key: 'name',
                    title: 'Name',
                    tooltip: 'Token Name',
                    setter: setForm,
                    value: form.name,
                }}
            />

            {/* Supply */}
            <div className=" border border-gray-400/25 p-3 pb-5 rounded-lg mt-5">
                <ERC20RangeInput
                    options={{
                        key: 'initialSupply',
                        title: 'Initial Supply',
                        tooltip: 'Intial token that will be mint for the owner',
                        value: form.initialSupply,
                        setter: setForm,
                    }}
                />
                <ERC20RangeInput
                    className="pt-3"
                    options={{
                        key: 'supplyCap',
                        title: 'Supply Cap',
                        tooltip: 'Maximum amount of tokens in system',
                        value: form.supplyCap,
                        setter: setForm,
                    }}
                />
            </div>

            {/* Switch Case */}
            <div className="border border-gray-400/25 p-3 pb-5 rounded-lg mt-5 grid grid-cols-3">
                <ERC20CheckboxInput
                    className="items-start"
                    options={{
                        key: 'mintable',
                        title: 'Mintable',
                        tooltip: 'Can owner mint tokens?',
                        value: form.mintable,
                        setter: setForm,
                    }}
                />

                <ERC20CheckboxInput
                    className="items-center"
                    options={{
                        key: 'burnable',
                        title: 'Burnable',
                        tooltip: 'Can owner burn tokens?',
                        value: form.burnable,
                        setter: setForm,
                    }}
                />
                <ERC20CheckboxInput
                    className="items-end"
                    options={{
                        key: 'pausable',
                        title: 'Pausable',
                        tooltip: 'Can owner pause mint or burn tokens?',
                        value: form.pausable,
                        setter: setForm,
                    }}
                />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-10">
                Deploy
            </button>
        </form>
    )

    const ERC20Body = (
        <div className="h-full rounded-lg bg-base-100">
            <div className="relative flex items-center h-[50px] border-b border-base-300 p-5">
                <div className="text-center">ERC20 Token</div>
            </div>
            {ERC20Form}
        </div>
    )

    return (
        <div className="erc20-page page py-5">
            <div className="wrapper center container min-h-screen">
                <div className="grid grid-cols-6 w-full h-full gap-5">
                    <div className="col-span-6 lg:col-span-2">{ERC20Body}</div>
                    <div className="col-span-6 lg:col-span-4">
                        <LoggerReact title="Token Deployer" user="JFIN" />
                    </div>
                </div>
            </div>
        </div>
    )
}
