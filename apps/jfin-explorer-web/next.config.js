/** @type {import('next').NextConfig} */

const { buildConfig } = require('@utils/app-nextjs/_index')

module.exports = phase =>
    buildConfig(phase, {
        experimental: {
            appDir: true,
        },
        env: {},
        experimental: {
            // Need to remove this setting to get @cloudflare/next-on-pages working
            outputFileTracingRoot: null,
        },
    })
