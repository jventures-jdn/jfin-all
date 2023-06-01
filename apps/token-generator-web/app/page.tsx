'use client'

import Link from 'next/link'
import { useNetwork } from 'wagmi'

export default function HomePage() {
    const { chain, chains } = useNetwork()

    console.log(chain, chains)
    return (
        <div className="home-page page">
            <div className="wrapper center">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 container text-primary-content">
                    <Link
                        href="/contract/ERC20"
                        className="card shadow-xl bg-gradient-to-br from-primary to-secondary"
                    >
                        <div className="card-body">
                            <h2>ERC20 &rarr;</h2>
                            <p>Token</p>
                        </div>
                    </Link>

                    <Link
                        href="/contract/ERC721"
                        className="card shadow-xl  bg-gradient-to-br from-primary to-secondary"
                    >
                        <div className="card-body">
                            <h2>ERC721 &rarr;</h2>
                            <p>Non-Fungible Token</p>
                        </div>
                    </Link>

                    <Link
                        href="/contract/ERC1155"
                        className="card shadow-xl  bg-gradient-to-br from-primary to-secondary"
                    >
                        <div className="card-body">
                            <h2>ERC1155 &rarr;</h2>
                            <p>Multi Token Standard</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
