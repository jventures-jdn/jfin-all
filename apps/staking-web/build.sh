# !/bin/bash

# FOR CLOUDFLARE PAGES BUILD

echo $CF_PAGES_BRANCH

if [[ $CF_PAGES_BRANCH == "release/mainnet" ]]; then
    NETWORK=jfin vite build mode=production
elif [[ $CF_PAGES_BRANCH == "release/testnet" ]]; then
    NETWORK=jfintest vite build mode=production
elif [[ $CF_PAGES_BRANCH =~ "mainnet" ]]; then
    NETWORK=jfin vite build mode=development
elif [[ $CF_PAGES_BRANCH =~ "testnet" ]]; then
    NETWORK=jfintest vite build mode=development
else
    echo Error : network not found in branch name
    exit 1
fi