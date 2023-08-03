import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'

export default defineConfig(({ mode }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd()),
        MODE: mode,
        PROD: mode === 'production',
    } as Record<string, any>

    return {
        base: './',
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {},
                },
            },
        },
        plugins: [
            react({
                babel: {
                    parserOpts: {
                        plugins: ['decorators-legacy', 'classProperties'],
                    },
                },
            }),
            sentryVitePlugin({
                disable: !process.env.PROD,
                org: 'jventures',
                project: 'jfin-staking',
                debug: !process.env.PROD,
                telemetry: !!process.env.PROD, // if true, internal plugin errors and performance data will be sent to Sentry.
                authToken: process.env.VITE_APP_SENTRY_TOKEN,
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src/'),
            },
        },
        define: {
            'process.env': process.env,
        },
    }
})
