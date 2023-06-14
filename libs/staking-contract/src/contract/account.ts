import BigNumber from 'bignumber.js'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { chainStaking } from '.'
import { GetAccountResult, fetchBalance, getAccount } from 'wagmi/actions'
import { PublicClient } from 'wagmi'
import { EXPECT_CHAIN } from '@utils/chain-config'
import { formatEther } from 'viem'

export class Account {
    constructor() {
        makeObservable(this, {
            isFetchingAccount: observable,
            isReady: observable,
            account: observable,
            balance: observable,
            getAccount: action,
            fetchBalance: action,
        })
    }
    /* ------------------------------- Properties ------------------------------- */
    public isFetchingAccount: boolean
    public isReady: boolean
    public account: Awaited<ReturnType<typeof getAccount>>
    public balance: number

    /* --------------------------------- Methods -------------------------------- */
    /**
     * get web3 wallet account
     */
    public async getAccount(): Promise<GetAccountResult<PublicClient>> {
        this.isReady = false
        const account = await getAccount()
        runInAction(() => {
            // clear staking state when account disconnected
            if (!account.address) {
                chainStaking.myStakingHistoryLogs = []
                chainStaking.myTotalReward = []
                chainStaking.myTotalStake = []
            }

            this.account = account
            this.isReady = true
        })
        return account
    }

    /**
     * fetch balance from user wallet
     */
    public async fetchBalance() {
        // clear balance when account is disconnected
        if (!this.account.address) {
            this.balance = 0
            return this.balance
        }

        const balance = await fetchBalance({
            address: this.account.address,
        })

        runInAction(() => {
            this.balance = Number(formatEther(balance.value))
        })

        return this.balance
    }
}
