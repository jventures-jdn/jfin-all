/** @type {import('next').NextConfig} */

const { buildConfig } = require('@utils/app-nextjs/_index')

module.exports = phase =>
    buildConfig(
        phase,
        {
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
            transpilePackages: ['@libs/*', '@utils/*', 'hardhat'],
        },
        config => {
            // TODO: remove this hack
            config.resolve.alias['handlebars'] = 'handlebars/dist/handlebars.js'
            config.module.rules.push({ test: /\.node$/, loader: 'node-loader' }) // verify contract
        },
    )
