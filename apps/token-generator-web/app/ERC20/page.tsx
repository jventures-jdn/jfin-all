'use client'

import { LoggerReact, useLoggerReact } from '@libs/logger-react'
import {
    ERC20CheckboxInput,
    ERC20RangeInput,
    ERC20TextInput,
} from '../../src/components/Form/Input'
import React, { FormEvent, useEffect, useState } from 'react'
import { ERC20Generator__factory } from '../../src/typechain/factories/contracts/ERC20/ERC20Generator__factory'
import { useAccount, useNetwork } from 'wagmi'
import { deployContract, logDeployData } from '../../src/utils/deployContract'
import { verifyContract } from '../../src/utils/verifyContract'
import { CHAIN_DECIMAL } from '@libs/wallet-connect-react'
import { useWeb3Modal } from '@web3modal/react'
import { HiInformationCircle } from 'react-icons/hi'

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
    const { isConnected } = useAccount()
    const logger = useLoggerReact()
    const { chain } = useNetwork()
    const [form, setForm] = useState(ERC20FormDefaultState)
    const { open, setDefaultChain } = useWeb3Modal()
    const [connected, setConnected] = useState(false)
    const minSupply = 0
    const maxSupply = 1000000
    const stepSupply = 10000

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
                    initialSupply: BigInt(form.initialSupply) * CHAIN_DECIMAL,
                    supplyCap: BigInt(form.supplyCap) * CHAIN_DECIMAL,
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
                    initialSupply: (BigInt(form.initialSupply) * CHAIN_DECIMAL).toString(),
                    supplyCap: (BigInt(form.supplyCap) * CHAIN_DECIMAL).toString(),
                    mintable: form.mintable,
                    burnable: form.burnable,
                    pausable: form.pausable,
                },
            ],
        })
    }

    /* --------------------------------- Watches -------------------------------- */
    useEffect(() => {
        if (!chain?.id) return
        setDefaultChain(chain)
    }, [chain])

    useEffect(() => {
        setConnected(isConnected)
    }, [isConnected])

    /* ---------------------------------- Doms ---------------------------------- */
    const ERC20Form = (
        <form className="p-5" onSubmit={handleDeploy}>
            <ERC20TextInput
                options={{
                    key: 'symbol',
                    title: 'Symbol',
                    tooltip: 'Token Symbol',
                    setter: setForm,
                    value: form.symbol,
                    disabled: !!logger.loading,
                }}
            />
            <ERC20TextInput
                options={{
                    key: 'name',
                    title: 'Name',
                    tooltip: 'Token Name',
                    setter: setForm,
                    value: form.name,
                    disabled: !!logger.loading,
                }}
            />
            {/* Supply */}
            <div className=" border border-gray-400/25 p-3 pb-5 rounded-lg mt-5">
                <div className={`form-control w-full pt-3`}>
                    <span className="label-text flex items-center">
                        <span>
                            Initial Supply
                            <input
                                type="number"
                                min={minSupply}
                                max={maxSupply}
                                onChange={e => {
                                    const value = +e.target.value
                                    if (value > maxSupply || value < minSupply) return
                                    if (value > form.supplyCap)
                                        setForm(form => ({
                                            ...form,
                                            supplyCap: value,
                                        }))

                                    setForm(form => ({
                                        ...form,
                                        initialSupply: value,
                                    }))
                                }}
                                value={form.initialSupply}
                                required
                                disabled={!!logger.loading}
                                className="ml-2 input input-xs input-bordered disabled:bg-base-300/0 disabled:border-gray-400/25"
                            />
                        </span>
                        {
                            <div
                                className="tooltip tooltip-secondary ml-1"
                                data-tip="Intial token that will be mint for the owner"
                            >
                                <div>
                                    <HiInformationCircle />
                                </div>
                            </div>
                        }
                    </span>
                    <input
                        type="range"
                        min={minSupply}
                        max={maxSupply}
                        value={form.initialSupply}
                        step={stepSupply}
                        className="range range-sm lg:range:md mt-2 disabled:opacity-10 disabled:cursor-not-allowed"
                        disabled={!!logger.loading}
                        onChange={e => {
                            const value = +e.target.value

                            if (value > form.supplyCap)
                                return setForm(form => ({
                                    ...form,
                                    supplyCap: value,
                                }))

                            setForm(form => ({
                                ...form,
                                initialSupply: value,
                            }))
                        }}
                    />
                </div>
                <div className={`form-control w-full pt-3`}>
                    <span className="label-text flex items-center">
                        <span>
                            Supply Cap
                            <input
                                type="number"
                                min={minSupply}
                                max={maxSupply}
                                onChange={e => {
                                    const value = +e.target.value
                                    if (value > maxSupply || value < minSupply) return
                                    if (value < form.initialSupply)
                                        setForm(form => ({
                                            ...form,
                                            initialSupply: value,
                                        }))

                                    setForm(form => ({
                                        ...form,
                                        supplyCap: value,
                                    }))
                                }}
                                value={form.supplyCap}
                                required
                                disabled={!!logger.loading}
                                className="ml-2 input input-xs input-bordered disabled:bg-base-300/0 disabled:border-gray-400/25"
                            />
                        </span>
                        {
                            <div
                                className="tooltip tooltip-secondary ml-1"
                                data-tip="Maximum amount of tokens in system"
                            >
                                <div>
                                    <HiInformationCircle />
                                </div>
                            </div>
                        }
                    </span>
                    <input
                        type="range"
                        min={minSupply}
                        max={maxSupply}
                        value={form.supplyCap}
                        step={stepSupply}
                        className="range range-sm lg:range:md mt-2 disabled:opacity-10 disabled:cursor-not-allowed"
                        disabled={!!logger.loading}
                        onChange={e => {
                            const value = +e.target.value

                            if (value < form.initialSupply) {
                                return setForm(form => ({
                                    ...form,
                                    initialSupply: value,
                                }))
                            }

                            setForm(form => ({
                                ...form,
                                supplyCap: value,
                            }))
                        }}
                    />
                </div>
            </div>
            {/* Switch Case */}
            <div className="border border-gray-400/25 p-3 pb-5 rounded-lg mt-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <ERC20CheckboxInput
                    className="items-baseline sm:items-start lg:items-baseline xl:items-start"
                    options={{
                        key: 'mintable',
                        title: 'Mintable',
                        tooltip: '"Contract Owner" can mint more tokens (max at supply cap)',
                        value: form.mintable,
                        setter: setForm,
                        disabled: !!logger.loading,
                    }}
                />

                <ERC20CheckboxInput
                    className="items-baseline sm:items-center lg:items-baseline xl:items-center"
                    options={{
                        key: 'burnable',
                        title: 'Burnable',
                        tooltip: '"Token Holder" can burn their own tokens',
                        value: form.burnable,
                        setter: setForm,
                        disabled: !!logger.loading,
                    }}
                />
                <ERC20CheckboxInput
                    className="items-baseline sm:items-end lg:items-baseline  xl:items-end"
                    options={{
                        key: 'pausable',
                        title: 'Pausable',
                        tooltip: '"Contract Owner" can pause all activities on this token',
                        value: form.pausable,
                        setter: setForm,
                        disabled: !!logger.loading,
                    }}
                />
            </div>

            <button
                key="1"
                type={connected ? 'submit' : 'button'}
                className="btn btn-primary  w-full mt-10 disabled:bg-primary/25"
                disabled={!!logger.loading}
                onClick={() => !connected && open()}
            >
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
