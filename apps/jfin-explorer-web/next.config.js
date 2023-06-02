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
        },
        config => {
            // TODO: remove this hack
            config.resolve.alias['handlebars'] = 'handlebars/dist/handlebars.js'
        },
    )
