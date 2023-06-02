'use client'

import { Web3Button } from '@web3modal/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname()

    return (
        <div className="navbar text-gray-400 border-b border-base-100 py-4">
            <div className="container">
                <div className="flex-1 flex-row flex items-center">
                    <Link href="/">
                        <img src="/brand.svg" className="h-[25px] lg:h-auto" />
                    </Link>
                    <div className="w-full text-sm hidden lg:block">
                        <Link
                            href="/contract/ERC20"
                            className={`${
                                ['/contract/ERC20'].includes(pathname) ? 'text-white' : ''
                            } pl-10`}
                        >
                            ERC20
                        </Link>
                        <Link
                            href="/contract/ERC721"
                            className={`${
                                pathname === '/contract/ERC721' ? 'text-white' : ''
                            } pl-10`}
                        >
                            ERC721
                        </Link>
                        <Link
                            href="/contract/ERC1155"
                            className={`${
                                pathname === '/contract/ERC1155' ? 'text-white' : ''
                            } pl-10`}
                        >
                            ERC1155
                        </Link>
                    </div>
                </div>
                <div className="flex-none">
                    <Web3Button />
                </div>
            </div>
        </div>
    )
}
