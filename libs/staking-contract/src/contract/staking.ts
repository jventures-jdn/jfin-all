import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { Validator, chainAccount, stakingObject } from '.'
import { BigNumber as $BigNumber, Event, Signer } from 'ethers'
import { Address } from 'abitype'
import {
    CHAIN_DECIMAL,
    EXPECT_CHAIN,
    VALIDATOR_STATUS_ENUM,
    CHAIN_GAS_PRICE,
    CHAIN_GAS_LIMIT_CUSTOM,
    bigIntDivideDecimal,
    VALIDATOR_STATUS_MAPPING,
} from '@utils/chain-config'
import { BigNumber } from 'bignumber.js'
import { getWalletClient, getPublicClient, getContract } from 'wagmi/actions'
import { chainConfig } from '.'
import { switchChainWhenIncorrectChain } from '../utils/wallet'

export class Staking {
    constructor() {
        makeObservable(this, {
            validators: observable,
            isFetchingValidators: observable,
            myStakingHistoryLogs: observable,
            stakeLogs: observable,
            unStakeLogs: observable,
            claimLogs: observable,
            getValidatorLogs: action,
            getMyStakingHistoryLogs: action,
            myTotalReward: observable,
            myTotalStake: observable,
            myValidators: observable,
            fetchValidators: action,
            updateValidators: action,
            activeValidator: computed,
            jailedValidator: computed,
            pendingValidator: computed,
            totalStake: computed,
        })
    }
    /* ------------------------------- Properties ------------------------------- */
    public isFetchingValidators: boolean
    public validators: Validator[]
    public myValidators: Validator[] = []
    public myTotalReward: { validator: Address; amount: BigNumber }[] = []
    public myTotalStake: { validator: Address; amount: BigNumber }[] = []
    public myStakingHistoryLogs: Awaited<ReturnType<typeof this.getMyStakingHistoryLogs>>
    public stakeLogs: Awaited<ReturnType<typeof this.getStakeLogs>>
    public unStakeLogs: Awaited<ReturnType<typeof this.getUnStakeLogs>>
    public claimLogs: Awaited<ReturnType<typeof this.getClaimLogs>>
    private validatorLogs: Awaited<ReturnType<typeof this.getValidatorLogs>>

    /* --------------------------------- Methods -------------------------------- */
    /* -------------------------------------------------------------------------- */
    /*                                   Helper                                   */
    /* -------------------------------------------------------------------------- */
    // public getValidatorEventArgs(args?: Result) {
    //     if (!args) return
    //     const [validator, staker, amount, epoch] = args as [
    //         validator: Address,
    //         staker: Address,
    //         amount: $BigNumber,
    //         epoch: $BigNumber,
    //     ]
    //     return {
    //         validator,
    //         staker,
    //         amount: new BigNumber(amount.toString()),
    //         epoch: new BigNumber(epoch.toString()),
    //     }
    // }

    /* -------------------------------------------------------------------------- */
    /*                                    Read                                    */
    /* -------------------------------------------------------------------------- */
    /**
     * Use for fetch "stake" events from giving wallet or validator address then update result to `stakeEvents`
     * - When giving wallet address will return events of specific wallet address in all validators.
     * - When giving validator address will return events of specific validator in all wallet.
     * - When giving both wallet and validator address will return events from specific wallet and validator address
     * @param {address} wallet - The wallet address
     * @param {address} validator - The validator address
     * @returns Stake events of giving wallet or validator
     */
    private async getStakeLogs(staker?: Address, validator?: Address) {
        const client = getPublicClient()
        const contract = getContract(stakingObject)
        const filter = await contract.createEventFilter.Delegated(
            { validator, staker },
            { fromBlock: 'earliest', toBlock: 'latest' },
        )

        const logs = await client.getFilterLogs({ filter })
        runInAction(() => {
            this.stakeLogs = logs
        })
        return logs
    }

    /**
     * Use for fetch "un-stake" events from giving wallet or validator address then update result to `unStakeEvents`
     * - When giving wallet address will return events of specific wallet address in all validators.
     * - When giving validator address will return events of specific validator in all wallet.
     * - When giving both wallet and validator address will return events from specific wallet and validator address
     * @param {address} wallet - The wallet address
     * @param {address} validator - The validator address
     * @returns Un-stake events of giving wallet or validator
     */
    private async getUnStakeLogs(staker?: Address, validator?: Address) {
        const client = getPublicClient()
        const contract = getContract(stakingObject)
        const cont = getContract(stakingObject)
        const filter = await contract.createEventFilter.Undelegated(
            { validator, staker },
            { fromBlock: 'earliest', toBlock: 'latest' },
        )
        const logs = await client.getFilterLogs({ filter })
        runInAction(() => {
            this.unStakeLogs = logs
        })
        return logs
    }

    /**
     * Use for fetch "claim" events from giving wallet or validator address then update result to `claimEvents`
     * - When giving wallet address will return events of specific wallet address in all validators.
     * - When giving validator address will return events of specific validator in all wallet.
     * - When giving both wallet and validator address will return events from specific wallet and validator address
     * @param {address} wallet - The wallet address
     * @param {address} validator - The validator address
     * @returns Claim events of giving wallet or validator
     */
    private async getClaimLogs(staker?: Address, validator?: Address) {
        const client = getPublicClient()
        const contract = getContract(stakingObject)
        const cont = getContract(stakingObject)
        const filter = await contract.createEventFilter.Claimed(
            { validator, staker },
            { fromBlock: 'earliest', toBlock: 'latest' },
        )
        const logs = await client.getFilterLogs({ filter })
        runInAction(() => {
            this.claimLogs = logs
        })
        return logs
    }

    /**
     * Get `added` events of validators
     * @returns  `added` events of validators
     */
    private async getAddedValidatorLogs() {
        const client = getPublicClient()
        const contract = getContract(stakingObject)

        const filter = await contract.createEventFilter.ValidatorAdded(
            {},
            { fromBlock: 'earliest', toBlock: 'latest' },
        )

        contract.createEventFilter
        // contract.createEventFilter

        // contract.
        // client.getLogs({ args: filter.args, event: filter.eventName })
        const logs = await client.getFilterLogs({ filter })
        return logs
    }

    /**
     * Get `removed` events of validators
     * @returns  `removed` events of validators
     */
    private async getRemovedValidatorLogs() {
        const client = getPublicClient()
        const contract = getContract(stakingObject)
        const filter = await contract.createEventFilter.ValidatorRemoved(
            {},
            { fromBlock: 'earliest', toBlock: 'latest' },
        )
        const logs = await client.getFilterLogs({ filter })
        return logs
    }

    /**
     * Get `jailed` events of validators
     * @returns  `jailed` events of validators
     */
    private async getJailedValidatorLogs() {
        const client = getPublicClient()
        const contract = getContract(stakingObject)
        const filter = await contract.createEventFilter.ValidatorJailed(
            {},
            { fromBlock: 'earliest', toBlock: 'latest' },
        )
        const logs = await client.getFilterLogs({ filter })
        return logs
    }

    /**
     * Get `added` `removed` `jailed` events of validators then update result to `validatorEvents`
     * @returns  `added` `removed` `jailed` events of validators
     */
    public async getValidatorLogs() {
        const [addedValidators, removedValidators] = await Promise.all([
            this.getAddedValidatorLogs(),
            this.getRemovedValidatorLogs(),
        ])

        const availableValidators = addedValidators.filter(
            i => !removedValidators.find(r => r.args.validator === r.args.validator),
        )

        this.validatorLogs = availableValidators
        return availableValidators
    }

    /**
     * Use for fetch `stake` `un-stake` `claim` events from user wallet address then update result to `myStakingHistoryEvents`
     * - If `myStakingHistoryEvents` is already exist this function will skip fetch procress
     * - If `myStakingHistoryEvents` is empty this function will fetch `fetchStakeEvents()` `fetchUnStakeEvents()` `fetchClaimEvents()`
     * @returns Events from `stake` `unstake` `claim` included sort event with blocknumber
     */
    public async getMyStakingHistoryLogs() {
        const address = chainAccount.account.address
        runInAction(() => {
            this.myStakingHistoryLogs = [] // clear events
        })
        if (!address) return

        const [stake, unstake, claim] = await Promise.all([
            this.getStakeLogs(address),
            this.getUnStakeLogs(address),
            this.getClaimLogs(address),
        ])

        // sort considered events
        const sortedLogs = [...stake, ...unstake, ...claim].sort(
            (prev, curr) => Number(curr.blockNumber) - Number(prev.blockNumber),
        )

        runInAction(() => {
            this.myStakingHistoryLogs = sortedLogs
        })
        return sortedLogs
    }

    /**
     * Use for fetch validator information from giving validator address and epoch
     * @returns Validator information
     */
    public async fetchValidator(validatorLog: (typeof this.validatorLogs)[0], epoch: number) {
        if (!validatorLog.args.validator)
            throw new Error('`fetchValidator: validatorLog.args.validator cannot be null`')

        const contract = getContract(stakingObject)
        const validator = await contract.read.getValidatorStatusAtEpoch([
            validatorLog.args.validator,
            BigInt(epoch),
        ])

        const [
            address,
            status,
            totalDelegated,
            slashesCount,
            changedAt,
            jailedBefore,
            claimedAt,
            commissionRate,
            totalRewards,
        ] = validator

        return {
            address,
            status: VALIDATOR_STATUS_MAPPING[status as keyof typeof VALIDATOR_STATUS_MAPPING],
            totalDelegated: bigIntDivideDecimal(
                totalDelegated,
                CHAIN_DECIMAL[EXPECT_CHAIN.chainNetwork],
            ),
            slashesCount,
            changedAt,
            jailedBefore,
            claimedAt,
            commissionRate,
            totalRewards: bigIntDivideDecimal(
                totalRewards,
                CHAIN_DECIMAL[EXPECT_CHAIN.chainNetwork],
            ),
            validatorLog: validatorLog,
        }
    }

    /**
     * Use for fetch all validators included validator information from system then update result to `validators`
     * - This function include state `isFetchingValidators`
     * @returns All validator information
     */
    public async fetchValidators() {
        runInAction(() => {
            this.isFetchingValidators = true
        })

        // get chain config if epoch is not valid
        if (!chainConfig.epoch) await chainConfig.fetchChainConfig()

        const epoch = chainConfig.epoch
        const validatorLogs = await this.getValidatorLogs()

        // const validators = await Promise.all(
        //     validatorLogs.map(validatorLog => this.fetchValidator(validatorLog, epoch)),
        // )

        // // sort validator base on blockNumber
        // const sortValidators = validators.sort(
        //     (prev, curr) =>
        //         Number(prev.validatorLog.blockNumber) - Number(curr.validatorLog.blockNumber),
        // )

        // runInAction(() => {
        //     this.validators = sortValidators
        //     this.isFetchingValidators = false
        // })

        // return sortValidators
    }

    /* -------------------------------------------------------------------------- */
    /*                                    Write                                   */
    /* -------------------------------------------------------------------------- */
    /**
     * Use for `claim` reward from giving validator address
     * - user must be signed in
     * - update validators from call `updateValidators()` after transaction finished
     * - update myValidators from call `fetchMyStakingValidators()`  after transaction finished
     * - update myTotalReward from call `calcMyTotalReward()` after transaction finished
     * @param validatorAddress validator address
     * @returns contract receipt
     */
    public async claimValidatorReward(validatorAddress: Address) {
        const client = await getWalletClient()
        const contract = getContract(stakingObject)
        const { request } = await contract.simulate.claimDelegatorFee([validatorAddress], {
            gasPrice: CHAIN_GAS_PRICE[EXPECT_CHAIN.chainNetwork],
            gasLimit: CHAIN_GAS_LIMIT_CUSTOM[EXPECT_CHAIN.chainNetwork].claim,
        })
        const transactionHash = await client?.writeContract(request)

        // update balance, validators, staking history
        await Promise.all([
            chainAccount.fetchBalance(),
            this.updateValidators(),
            this.getMyStakingHistoryLogs(),
        ])

        return transactionHash
    }

    /**
     * Use for `stake` amount of token to giving validator
     * - user must be signed in
     * - update validators from call `updateValidators()` after transaction finished
     * - update myValidators from call `fetchMyStakingValidators()`  after transaction finished
     * - update myTotalReward from call `calcMyTotalReward()` after transaction finished
     * @param validatorAddress validator address
     * @param amount amount of token to stake
     * @returns contract receipt
     */
    public async stakeToValidator(validatorAddress: Address, amount: bigint) {
        await switchChainWhenIncorrectChain()
        const client = await getWalletClient()
        const contract = getContract(stakingObject)
        const { request } = await contract.simulate.delegate([validatorAddress], {
            gasPrice: CHAIN_GAS_PRICE[EXPECT_CHAIN.chainNetwork],
            value: amount * CHAIN_DECIMAL[EXPECT_CHAIN.chainNetwork],
        })

        const transactionHash = await client?.writeContract(request)

        // update balance, validators, staking history
        await Promise.all([
            chainAccount.fetchBalance(),
            this.updateValidators(),
            this.getMyStakingHistoryLogs(),
        ])

        return transactionHash
    }

    /**
     * Use for `un-stake` amount of token to giving validator
     * - user must be signed in
     * - update validators from call `updateValidators()` after transaction finished
     * - update myValidators from call `fetchMyStakingValidators()`  after transaction finished
     * - update myTotalReward from call `calcMyTotalReward()` after transaction finished
     * @param validatorAddress validator address
     * @param amount amount of token to un-stake
     * @returns contract receipt
     */
    public async unstakeFromValidator(validatorAddress: Address, amount: bigint) {
        await switchChainWhenIncorrectChain()
        const client = await getWalletClient()
        const contract = getContract(stakingObject)
        const { request } = await contract.simulate.undelegate([
            validatorAddress,
            amount * CHAIN_DECIMAL[EXPECT_CHAIN.chainNetwork],
        ])
        const transactionHash = await client?.writeContract(request)

        // update balance, validators, staking history
        await Promise.all([
            chainAccount.fetchBalance(),
            this.updateValidators(),
            this.getMyStakingHistoryLogs(),
        ])

        return transactionHash
    }

    public async updateValidators() {
        if (!this.validatorLogs.length) {
            throw new Error(
                'No validatorEvents found. Ensure you have set fetch validator with `fetchValidators()`',
            )
        }
        runInAction(() => {
            this.isFetchingValidators = true
        })

        // get chain config if epoch is not valid
        if (!chainConfig.epoch) {
            await chainConfig.fetchChainConfig()
        }

        const validators = await Promise.all(
            this.validatorLogs.map(validatorLog =>
                this.fetchValidator(validatorLog, chainConfig.epoch),
            ),
        )

        // sort validator base on blockNumber
        const sortValidators = validators.sort(
            (prev, curr) =>
                Number(prev.validatorLog.blockNumber) - Number(curr.validatorLog.blockNumber),
        )

        runInAction(() => {
            this.myValidators = []
            this.myTotalReward = []
            this.myTotalStake = []
            this.validators = sortValidators
            this.isFetchingValidators = false
        })
        return sortValidators
    }

    /* -------------------------------------------------------------------------- */
    /*                                 Calculator                                 */
    /* -------------------------------------------------------------------------- */

    /**
     * Calculate validator apr from giving validator
     * @remark this function base on old sdk library
     * @param validatorAddress validator address
     * @returns  apr percentage
     */
    public calcValidatorApr(validatorAddress: Address) {
        const validator = this.validators.find(
            validator => validator.validatorLog.args.owner === validatorAddress,
        )
        if (!validator) return 0

        const blockReward = this.calcValidatorBlockReward(this.activeValidator.length)
        const validatorTotalReward = validator.totalRewards + blockReward
        const validatorTotalStake = validator.totalDelegated

        const apr =
            365 *
            (100 *
                bigIntDivideDecimal(
                    BigInt(validatorTotalReward / validatorTotalStake),
                    CHAIN_DECIMAL[EXPECT_CHAIN.chainNetwork],
                ))

        return apr
    }

    /**
     * Calculate validator block reward from giving validator length
     * @remark this function base on old sdk library
     * @param validatorAddress length of validator
     * @returns number of blockreward
     */
    public calcValidatorBlockReward(validatorAmount: number) {
        return bigIntDivideDecimal(
            BigInt((28800 * 0.6 * 0.603) / validatorAmount),
            CHAIN_DECIMAL[EXPECT_CHAIN.chainNetwork],
        )
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Getters                                  */
    /* -------------------------------------------------------------------------- */

    /**
     * Get user staking reward from giving validator address
     * @param validatorAddress validator wallet address
     * @returns reward of user staking
     */
    public async getMyStakingRewards(validatorAddress: Address) {
        const delegator = chainAccount.account.address
        if (!delegator) return BigNumber(0)
        const contract = getContract(stakingObject)
        const staking = this.contract.connect(this.provider)

        const reward = await staking
            .getDelegatorFee(validatorAddress, delegator)
            .catch(() => $BigNumber.from(0))

        if (!reward.isZero() && !this.myValidators.find(v => v.ownerAddress === validatorAddress)) {
            const validator = this.validators.find(v => v.ownerAddress === validatorAddress)
            if (!validator) return BigNumber(0)

            runInAction(() => {
                this.myValidators.push(validator)
            })
        }

        if (!reward.isZero() && !this.myTotalReward.find(i => i.validator === validatorAddress)) {
            this.myTotalReward.push({
                validator: validatorAddress as Address,
                amount: BigNumber(reward.toString()),
            })
        }

        return BigNumber(reward.toString()).div(CHAIN_DECIMAL)
    }

    /**
     * Get user staking amount from giving validator address
     * @param validatorAddress validator wallet address
     * @returns amount of user staking
     */
    public async getMyStakingAmount(validatorAddress: Address) {
        this.isProviderValid()

        const delegator = chainAccount.account.address
        if (!delegator) return BigNumber(0)
        const staking = this.contract.connect(this.provider)

        const amount = await staking
            .getValidatorDelegation(validatorAddress, delegator)
            .catch(() => ({
                delegatedAmount: $BigNumber.from(0),
            }))

        if (
            !amount.delegatedAmount.isZero() &&
            !this.myValidators.find(v => v.ownerAddress === validatorAddress)
        ) {
            const validator = this.validators.find(v => v.ownerAddress === validatorAddress)
            if (!validator) return BigNumber(0)

            runInAction(() => {
                this.myValidators.push(validator)
            })
        }

        if (
            !amount.delegatedAmount.isZero() &&
            !this.myTotalStake.find(i => i.validator === validatorAddress)
        ) {
            this.myTotalStake.push({
                validator: validatorAddress as Address,
                amount: BigNumber(amount.delegatedAmount.toString()),
            })
        }

        return BigNumber(amount.delegatedAmount.toString()).div(CHAIN_DECIMAL)
    }

    get activeValidator() {
        if (!this.validators) return []

        return this.validators.filter(validator => {
            return validator.status === VALIDATOR_STATUS_ENUM.ACTIVE
        })
    }

    get pendingValidator() {
        if (!this.validators) return []
        return this.validators.filter(
            validator => validator.status === VALIDATOR_STATUS_ENUM.PENDING,
        )
    }

    get jailedValidator() {
        if (!this.validators) return []
        return this.validators.filter(
            validator => validator.status === VALIDATOR_STATUS_ENUM.JAILED,
        )
    }

    get totalStake() {
        if (!this.validators) return BigNumber(0)
        const total = this.validators.reduce(
            (total, validator) => total.plus(validator.totalDelegated),
            BigNumber(0),
        )
        return total
    }
}
