'use client'

import { LoggerReact, useLoggerReact } from '@libs/logger-react'
import { CommonComponentProps } from '@utils/app-nextjs'
import { useEffect, useState } from 'react'

export interface ERC20Form {
    symbol: string
    name: string
    initialSupply: number
    supplyCap: number
    mintable: boolean
    burnable: boolean
    pausable: boolean
}
export const ERC20FormDefaultState: ERC20Form = {
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
    const [form, setForm] = useState(ERC20FormDefaultState)
    const [error, setError] = useState<Partial<Record<keyof ERC20Form, any>>>({})
    const supplyMin = 100000
    const supplyMax = 1000000
    const supplyStep = 100000

    /* --------------------------------- Watches -------------------------------- */
    useEffect(() => {
        logger.addMessage(`🗳️ Chain ID : ${1}`)
    }, [])

    /* ---------------------------------- Doms ---------------------------------- */
    const ERC20Body = (props: CommonComponentProps) => (
        <div className={` h-full rounded-lg bg-base-100 ${props.className || ''}`}>
            <div className="relative flex items-center h-[50px] border-b border-base-300 p-5">
                <div className="text-center">ERC20 Token</div>
            </div>
            <ERC20Form />
        </div>
    )

    const ERC20Form = () => (
        <form className="p-5">
            {/* Symbol */}
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">Symbol</span>
                </label>
                <input
                    type="text"
                    placeholder="Symbol"
                    required
                    className="input input-sm lg:input-md input-bordered w-full max-w-xs"
                />
            </div>

            {/* Name */}
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">Name</span>
                </label>
                <input
                    type="text"
                    placeholder="Name"
                    required
                    className="input input-sm lg:input-md input-bordered w-full max-w-xs"
                />
            </div>

            {/* Supply */}
            <div className=" border border-gray-400/25 p-3 pb-5 rounded-lg mt-5">
                {/* Initial Supply */}
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">
                            Initial Supply: <b>{form.initialSupply.toLocaleString()}</b>
                        </span>
                    </label>
                    <input
                        type="range"
                        min={supplyMin}
                        max={supplyMax}
                        value={form.initialSupply}
                        step={supplyStep}
                        className="range range-sm lg:range:md"
                        onChange={e =>
                            setForm(form => ({
                                ...form,
                                initialSupply: +e.target.value,
                            }))
                        }
                    />
                </div>

                {/* Supply Cap */}
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">
                            Supply Cap <b>{form.supplyCap.toLocaleString()}</b>
                        </span>
                    </label>
                    <input
                        type="range"
                        min={supplyMin}
                        max={supplyMax}
                        value={form.supplyCap}
                        step={supplyStep}
                        className="range range-sm lg:range:md"
                        onChange={e =>
                            setForm(form => ({
                                ...form,
                                supplyCap: +e.target.value,
                            }))
                        }
                    />
                </div>
            </div>

            {/* Switch Case */}
            <div className=" border border-gray-400/25 p-3 pb-5 rounded-lg mt-5 grid grid-cols-3">
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Mintable</span>
                    </label>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={form.mintable}
                        onChange={e => setForm(form => ({ ...form, mintable: e.target.checked }))}
                    />
                </div>
                <div className="form-control flex items-center">
                    <label className="label cursor-pointer">
                        <span className="label-text">Burnable</span>
                    </label>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={form.burnable}
                        onChange={e => setForm(form => ({ ...form, burnable: e.target.checked }))}
                    />
                </div>
                <div className="form-control flex items-end">
                    <label className="label cursor-pointer">
                        <span className="label-text">Pausable</span>
                    </label>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={form.pausable}
                        onChange={e => setForm(form => ({ ...form, pausable: e.target.checked }))}
                    />
                </div>
            </div>

            <button className="btn btn-primary w-full mt-10" type="submit">
                Deploy
            </button>
        </form>
    )

    return (
        <div className="erc20-page page py-5">
            <div className="wrapper center container min-h-screen">
                <div className="grid grid-cols-6 w-full h-full gap-5">
                    <ERC20Body className="col-span-6 lg:col-span-2" />
                    <LoggerReact
                        className="col-span-6 lg:col-span-4 "
                        title="Token Deployer"
                        user="JFIN"
                    />
                </div>
            </div>
        </div>
    )
}
