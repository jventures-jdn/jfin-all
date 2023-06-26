# !/bin/bash

# FOR CLOUDFLARE PAGES BUILD

echo $CF_PAGES_BRANCH

if [[ $CF_PAGES_BRANCH =~ "staking" ]]; then
    # STAKING 
    if [[ $CF_PAGES_BRANCH =~ "release" ]]; then
        if [[ $CF_PAGES_BRANCH =~ "mainnet" ]]; then
            pnpm -C apps/staking-web build:jfin --outDir=../../dist
        elif [[ $CF_PAGES_BRANCH =~ "testnet" ]]; then
            pnpm -C apps/staking-web build:jfintest --outDir=../../dist
        else
            echo Error : network not found in branch name A
            exit 1
        fi
    else
        if [[ $CF_PAGES_BRANCH =~ "mainnet" ]]; then
            pnpm -C apps/staking-web build:jfin:preview --outDir=../../dist
        elif [[ $CF_PAGES_BRANCH =~ "testnet" ]]; then
            pnpm -C apps/staking-web build:jfintest:preview  --outDir=../../dist
        else
            echo Error : network not found in branch name B
            exit 1
        fi
    fi
else
    echo Error : project not support
    exit 1
fi