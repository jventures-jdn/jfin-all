'use client'

import React from 'react'
import Link from 'next/link'
import { useNetwork } from 'wagmi'

export default function HomePage() {
    return (
        <div className="home-page page">
            <div className="wrapper center h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 container text-primary-content">
                    <div className="lg:col-span-3 lg:pb-[5vh] flex justify-center flex-col items-center">
                        <span className="text-3xl lg:text-5xl font-bold">Token Generator 🥳</span>
                        <span className="pt-1 text-gray-300">
                            Start generating your tokens. just a few clicks
                        </span>
                    </div>
                    <Link
                        href="/ERC20"
                        className="card shadow-xl bg-gradient-to-br from-primary to-secondary"
                    >
                        <div className="card-body">
                            <h2>ERC20 &rarr;</h2>
                            <p>Token</p>
                        </div>
                    </Link>

                    <Link
                        href="/ERC721"
                        className="card shadow-xl  bg-gradient-to-br from-primary to-secondary"
                    >
                        <div className="card-body">
                            <h2>ERC721 &rarr;</h2>
                            <p>Non-Fungible Token</p>
                        </div>
                    </Link>

                    <Link
                        href="/ERC1155"
                        className="card shadow-xl bg-gradient-to-br from-primary to-secondary"
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