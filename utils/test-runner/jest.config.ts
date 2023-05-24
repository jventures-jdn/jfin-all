import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
    // [...]
    verbose: true,
    transform: {
        // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: process.env.INVOKER_TSCONFIG_PATH,
            },
        ],
    },
    setupFilesAfterEnv: ['./src/config.ts'],
    testTimeout: 180000,
}

module.exports = jestConfig
