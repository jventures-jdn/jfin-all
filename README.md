<p align="center">
  <a href="https://jfinchain.com/" target="blank"><img src="https://static.wixstatic.com/media/ff114f_a8511d92b57c4e6ea27422ede46f5f57~mv2.png/v1/fill/w_69,h_69,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/JFIN%20Logo-06.png" height="100" alt="JFINCHAIN Logo" /></a>
</p>
<p align="center">JFIN CHAIN BEYOND THE FUTURE.</p>

<p align="center">
    <a href="https://www.facebook.com/JFINofficial" target="_blank">
        <img src="https://img.shields.io/badge/Facebook-1877F2?style=social&logo=facebook">
    </a>
    <a href="https://twitter.com/jfinofficial" target="_blank">
        <img src="https://img.shields.io/github/followers/jventures-jdn?style=social">
    </a>
</p>
<hr/>

<p align="center">
    Official <a href="https://github.com/jventures-jdn/jfin-all">JFIN Monorepo</a>
</p>

# Jfin Staking

-   In order to start staking website, go to apps/staking-web and run
    ```
    pnpm install (install dependencies)
    pnpm dev:jfin (run project as mainnet)
    pnpm dev:jfintest (run project as testnet)
    pnpm dev:jfindev (run project as devnet)
    ```

## Deploy

-   In order to deploy website, we split into 2 stage, once is `preview` and `release`
-   deploy preview by merge your feature branch into preview branch `staking-preview-[devnet,testnet,mainnet]`
-   deploy release by merge `staking-preview-[devnet,testnet,mainnet]` into release branch `staking-release-[devnet,testnet,mainnet]`
-   Example `staking-preview-devnet.feature1` --> (deploy to preview devnet) `staking-preview-devnet` --> (deploy to release devnet) `staking-release-devnet`
-   Example `staking-release-devnet` --> `staking-preview-mainnet`

## Team

-   [JDN Team](https://github.com/orgs/jventures-jdn)

## Contact Us

For business inquiries: info@jventures.co.th
