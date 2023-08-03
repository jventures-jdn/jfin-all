const path = require('path')
const { _ } = require('@utils/js-utilities/index_')
const { PHASE_PRODUCTION_SERVER } = require('next/constants')

module.exports = (phase, config, customWebpack) => {
    const baseConfig = {
        reactStrictMode: false,
        swcMinify: true,
        transpilePackages: ['@libs/*', '@utils/*'],
        // experimental: {
        //     // this includes files from the monorepo base two directories up
        //     outputFileTracingRoot: path.join(process.cwd(), '../../'),
        // },
        webpack(config, { webpack }) {
            config.resolve.fallback = {
                ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
                // by next.js will be dropped. Doesn't make much sense, but how it is
                fs: false, // the solution
            }
            // customize webpack
            customWebpack?.(config, { webpack })
            return config
        },
    }

    // Here we only supply configuration-related env when dev or build to replace all process.env.[name]
    // At runtime, we directly run server.js so this next config is not called
    if (phase !== PHASE_PRODUCTION_SERVER) {
        baseConfig.env = require('@utils/build-env')
    }

    const nextConfig = _.merge(baseConfig, config || {})
    return nextConfig
}
