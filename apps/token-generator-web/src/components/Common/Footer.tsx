import packageJson from '../../../package.json'
import React from 'react'

export default function Footer() {
    return (
        <div className="text-primary-content bg-gradient-to-br from-base-200 to-base-300 ">
            <div className="container py-2 text-gray-400 text-center text-sm">
                <span>
                    V{packageJson.version}, Copyright ©2023
                    <a href="https://www.jventures.co.th/" className="text-primary" target="_blank">
                        {' '}
                        {packageJson.author}
                    </a>
                </span>
            </div>
        </div>
    )
}
