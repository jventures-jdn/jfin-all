/** @type {import('next').NextConfig} */

const { buildConfig } = require('@utils/app-nextjs/_index')

module.exports = phase =>
    buildConfig(phase, {
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: '**',
                },
            ],
        },
        experimental: {
            appDir: true,
        },
        env: {},
        output: 'export',
    })
