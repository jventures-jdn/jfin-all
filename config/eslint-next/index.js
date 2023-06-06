module.exports = {
    extends: ['turbo', 'next/core-web-vitals', 'prettier', 'next'],
    ignorePatterns: ['node_modules', 'dist', 'out', '.next'],
    rules: {
        '@next/next/no-html-link-for-pages': 'off',
        'turbo/no-undeclared-env-vars': 'off',
        '@next/next/no-img-element': 'off',
    },
}
