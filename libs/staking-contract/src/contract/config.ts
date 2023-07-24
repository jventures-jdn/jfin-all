import { fetchBlockNumber, readContracts } from 'wagmi/actions'
import { EXPECT_CHAIN } from '@utils/chain-config'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { chainConfigObject } from '.'
import { formatEther } from 'viem'

// All config calculate base on old javascript sdk
export class Config {
    /* ------------------------------- Properties ------------------------------- */
    constructor() {
        makeObservable(this, {
            isReady: observable,
            epoch: observable,
            nextEpochIn: observable,
            endBlock: observable,
            startBlock: observable,
            blockNumber: observable,
            activeValidatorsLength: observable,
            epochBlockInterval: observable,
            misdemeanorThreshold: observable,
            felonyThreshold: observable,
            validatorJailEpochLength: observable,
            undelegatePeriod: observable,
            minValidatorStakeAmount: observable,
            minStakingAmount: observable,
            epochBlockIntervalSec: observable,
            undelegateIntervalSec: observable,
            validatorJailIntervalSec: observable,
            getConfig: computed,
            fetchChainConfig: action,
            updateChainConfig: action,
        })
    }

    public isReady = false
    public blockSec = 3 // base on sdk
    public epoch: number
    public nextEpochIn: number
    public endBlock: number
    public startBlock: number
    public blockNumber: bigint
    public activeValidatorsLength: number
    public epochBlockInterval: number
    public misdemeanorThreshold: number
    public felonyThreshold: number
    public validatorJailEpochLength: number
    public undelegatePeriod: number
    public minValidatorStakeAmount: number
    public minStakingAmount: number
    public epochBlockIntervalSec: number
    public undelegateIntervalSec: number
    public validatorJailIntervalSec: number

    /* --------------------------------- Methods -------------------------------- */
    /* -------------------------------------------------------------------------- */
    /*                                 Calculation                                */
    /* -------------------------------------------------------------------------- */
    private calcStartBlock() {
        return ((Number(this.blockNumber) / this.epochBlockInterval) | 0) * this.epochBlockInterval
    }

    private calcEndBlock() {
        return this.startBlock + Number(this.epochBlockInterval)
    }

    private calcEpoch() {
        return Math.floor(Number(this.blockNumber) / this.epochBlockInterval)
    }

    private calcNextEpochIn() {
        const blockRemain = this.endBlock - Number(this.blockNumber)
        return blockRemain * this.blockSec
    }

    private calcBlockIntervalSec() {
        return this.epochBlockInterval * this.blockSec
    }

    private calcUndelegateIntervalSec() {
        return this.undelegatePeriod * this.epochBlockInterval * this.blockSec
    }

    private calcValidatorJailIntervalSec() {
        return this.validatorJailEpochLength * this.epochBlockInterval * this.blockSec
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Fetcher                                  */
    /* -------------------------------------------------------------------------- */

    /**
     * Fetch chain config
     * @returns chain config from `getConfig()`
     */
    public async fetchChainConfig() {
        if (this.isReady) return

        // prepare promises fetch
        const promiseFetchBlockNumber = fetchBlockNumber({
            chainId: EXPECT_CHAIN.chainId,
        })

        const promiseReadContracts = readContracts({
            contracts: [
                {
                    ...chainConfigObject,
                    functionName: 'getActiveValidatorsLength',
                    chainId: EXPECT_CHAIN.chainId,
                },
                {
                    ...chainConfigObject,
                    functionName: 'getEpochBlockInterval',
                    chainId: EXPECT_CHAIN.chainId,
                },
                {
                    ...chainConfigObject,
                    functionName: 'getMisdemeanorThreshold',
                    chainId: EXPECT_CHAIN.chainId,
                },
                {
                    ...chainConfigObject,
                    functionName: 'getFelonyThreshold',
                    chainId: EXPECT_CHAIN.chainId,
                },
                {
                    ...chainConfigObject,
                    functionName: 'getValidatorJailEpochLength',
                    chainId: EXPECT_CHAIN.chainId,
                },
                {
                    ...chainConfigObject,
                    functionName: 'getUndelegatePeriod',
                    chainId: EXPECT_CHAIN.chainId,
                },
                {
                    ...chainConfigObject,
                    functionName: 'getMinValidatorStakeAmount',
                    chainId: EXPECT_CHAIN.chainId,
                },
                {
                    ...chainConfigObject,
                    functionName: 'getMinStakingAmount',
                    chainId: EXPECT_CHAIN.chainId,
                },
            ],
        })

        const [
            _blockNumber,
            [
                _activeValidatorsLength,
                _epochBlockInterval,
                _misdemeanorThreshold,
                _felonyThreshold,
                _validatorJailEpochLength,
                _undelegatePeriod,
                _minValidatorStakeAmount,
                _minStakingAmount,
            ],
        ] = await Promise.all([promiseFetchBlockNumber, promiseReadContracts])

        // mapping fetch result to property
        runInAction(() => {
            this.blockNumber = _blockNumber
            this.activeValidatorsLength = _activeValidatorsLength.result || 0
            this.epochBlockInterval = _epochBlockInterval.result || 0
            this.misdemeanorThreshold = _misdemeanorThreshold.result || 0
            this.felonyThreshold = _felonyThreshold.result || 0
            this.validatorJailEpochLength = _validatorJailEpochLength.result || 0
            this.undelegatePeriod = _undelegatePeriod.result || 0
            this.minValidatorStakeAmount = Number(
                formatEther(_minValidatorStakeAmount.result || BigInt(0)),
            )
            this.minStakingAmount = Number(formatEther(_minStakingAmount.result || BigInt(0)))
            this.startBlock = this.calcStartBlock()
            this.endBlock = this.calcEndBlock()
            this.epoch = this.calcEpoch()
            this.nextEpochIn = this.calcNextEpochIn()
            this.epochBlockIntervalSec = this.calcBlockIntervalSec()
            this.undelegateIntervalSec = this.calcUndelegateIntervalSec()
            this.validatorJailIntervalSec = this.calcValidatorJailIntervalSec()
            this.isReady = true
        })

        // return all chain config
        return this.getConfig
    }

    /**
     * Get the latest block number and update the relevant propperty
     */
    public async updateChainConfig() {
        const _blockNumber = await fetchBlockNumber({ chainId: EXPECT_CHAIN.chainId })
        runInAction(() => {
            this.blockNumber = _blockNumber
            this.startBlock = this.calcStartBlock()
            this.endBlock = this.calcEndBlock()
            this.epoch = this.calcEpoch()
            this.nextEpochIn = this.calcNextEpochIn()
        })
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Getters                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * get all chain propperty
     */
    public get getConfig() {
        return {
            blockSec: this.blockSec,
            epoch: this.epoch,
            endBlock: this.endBlock,
            startBlock: this.startBlock,
            blockNumber: this.blockNumber,
            activeValidatorsLength: this.activeValidatorsLength,
            epochBlockInterval: this.epochBlockInterval,
            misdemeanorThreshold: this.misdemeanorThreshold,
            felonyThreshold: this.felonyThreshold,
            validatorJailEpochLength: this.validatorJailEpochLength,
            undelegatePeriod: this.undelegatePeriod,
            minValidatorStakeAmount: this.minValidatorStakeAmount,
            minStakingAmount: this.minStakingAmount,
            nextEpochIn: this.nextEpochIn,
            epochBlockIntervalSec: this.epochBlockIntervalSec,
            undelegateIntervalSec: this.undelegateIntervalSec,
            validatorJailIntervalSec: this.validatorJailIntervalSec,
        }
    }
}
