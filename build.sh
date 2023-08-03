# !/bin/bash

# FOR CLOUDFLARE PAGES BUILD

echo $CF_PAGES_BRANCH

if [[ $CF_PAGES_BRANCH =~ "staking" ]]; then
    # STAKING 
    if [[ $CF_PAGES_BRANCH =~ "release" ]]; then
        if [[ $CF_PAGES_BRANCH =~ "testnet" ]]; then
            # testnet
            pnpm -C apps/staking-web build:jfintest --outDir=../../dist
        else
            # mainnet
            pnpm -C apps/staking-web build:jfin --outDir=../../dist
        fi
    else
        if [[ $CF_PAGES_BRANCH =~ "testnet" ]]; then
            # testnet
            pnpm -C apps/staking-web build:jfintest:preview  --outDir=../../dist
        else
            # mainnet
            pnpm -C apps/staking-web build:jfin:preview --outDir=../../dist
        fi
    fi
else
    echo Error : project not support
    exit 1
fi