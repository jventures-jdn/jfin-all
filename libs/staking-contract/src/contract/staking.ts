import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { Validator, chainAccount, stakingObject } from '.'
import { Address } from 'abitype'
import {
    EXPECT_CHAIN,
    VALIDATOR_STATUS_ENUM,
    CHAIN_GAS_PRICE,
    CHAIN_GAS_LIMIT_CUSTOM,
    VALIDATOR_STATUS_MAPPING,
} from '@utils/chain-config'
import { getWalletClient, getPublicClient, getNetwork } from 'wagmi/actions'
import { chainConfig } from '.'
import { switchChainWhenIncorrectChain } from '../utils/wallet'
import { formatEther, getAbiItem, getContract, parseEther } from 'viem'

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
    public isFetchingValidators = true
    public isReady = false
    public validators: Validator[] = []
    public myValidators: Address[] = []
    public myTotalReward: { validator: Address; amount: bigint }[] = []
    public myTotalStake: { validator: Address; amount: bigint }[] = []
    public myStakingHistoryLogs: Awaited<ReturnType<typeof this.getMyStakingHistoryLogs>>
    public stakeLogs: Awaited<ReturnType<typeof this.getStakeLogs>>
    public unStakeLogs: Awaited<ReturnType<typeof this.getUnStakeLogs>>
    public claimLogs: Awaited<ReturnType<typeof this.getClaimLogs>>
    private validatorLogs: Awaited<ReturnType<typeof this.getValidatorLogs>>

    /* --------------------------------- Methods -------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                    Logs                                    */
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
        const abiItem = getAbiItem({ abi: contract.abi, name: 'Delegated' })
        const logs = await client.getLogs({
            event: abiItem,
            args: { validator, staker },
            fromBlock: 'earliest',
            toBlock: 'latest',
        })

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
        const abiItem = getAbiItem({ abi: contract.abi, name: 'Undelegated' })
        const logs = await client.getLogs({
            event: abiItem,
            args: { validator, staker },
            fromBlock: 'earliest',
            toBlock: 'latest',
        })
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
        const abiItem = getAbiItem({ abi: contract.abi, name: 'Claimed' })
        const logs = await client.getLogs({
            event: abiItem,
            args: { validator, staker },
            fromBlock: 'earliest',
            toBlock: 'latest',
        })
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
        const client = getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        const contract = getContract(stakingObject)
        const abiItem = getAbiItem({ abi: contract.abi, name: 'ValidatorAdded' })
        const logs = await client.getLogs({
            event: abiItem,
            args: {},
            fromBlock: 'earliest',
            toBlock: 'latest',
        })

        return logs
    }

    /**
     * Get `removed` events of validators
     * @returns  `removed` events of validators
     */
    private async getRemovedValidatorLogs() {
        const client = getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        const contract = getContract(stakingObject)
        const abiItem = getAbiItem({ abi: contract.abi, name: 'ValidatorRemoved' })
        const logs = await client.getLogs({
            event: abiItem,
            args: {},
            fromBlock: 'earliest',
            toBlock: 'latest',
        })
        return logs
    }

    /**
     * Get `jailed` events of validators
     * @returns  `jailed` events of validators
     */
    private async getJailedValidatorLogs() {
        const client = getPublicClient()
        const contract = getContract(stakingObject)
        const abiItem = getAbiItem({ abi: contract.abi, name: 'ValidatorJailed' })
        const logs = await client.getLogs({
            event: abiItem,
            args: {},
            fromBlock: 'earliest',
            toBlock: 'latest',
        })
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

    /* -------------------------------------------------------------------------- */
    /*                                   Fetcher                                  */
    /* -------------------------------------------------------------------------- */

    /**
     * Use for fetch validator information from giving validator address and epoch
     * @returns Validator information
     */
    public async fetchValidator(validatorLog: (typeof this.validatorLogs)[0], epoch: number) {
        if (!validatorLog.args.validator)
            throw new Error(
                '[fetchValidator] No validatorLogs found. Ensure you get validator log from `getValidatorLogs()`',
            )

        const client = getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        const contract = getContract({ ...stakingObject, publicClient: client })
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

        await this.getMyStakingRewards(address)
        await this.getMyStakingAmount(address)

        return {
            validatorLog: validatorLog,
            address,
            owner: validatorLog.args.owner,
            status: status as keyof typeof VALIDATOR_STATUS_MAPPING,
            totalDelegated: totalDelegated,
            slashesCount: parseEther(`${slashesCount}`),
            changedAt: changedAt,
            jailedBefore: jailedBefore,
            claimedAt: claimedAt,
            commissionRate: parseEther(`${commissionRate}`),
            totalRewards: totalRewards,
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

        // parallel fetch validator
        const epoch = chainConfig.epoch
        const validatorLogs = await this.getValidatorLogs()
        const validators = await Promise.all(
            validatorLogs.map(validatorLog => this.fetchValidator(validatorLog, epoch)),
        )

        // sort validator base on blockNumber
        const sortValidators = validators.sort((prev, curr) => {
            return Number(prev.validatorLog.blockNumber) - Number(curr.validatorLog.blockNumber)
        })

        runInAction(() => {
            this.validators = sortValidators
            this.isFetchingValidators = false
            this.isReady = true
        })

        return sortValidators
    }

    public async updateValidators() {
        if (!this.validatorLogs.length) {
            throw new Error(
                '[updateValidators] No validatorEvents found. Ensure you have set fetch validator with `fetchValidators()`',
            )
        }
        runInAction(() => {
            this.isFetchingValidators = true
            this.myValidators = []
            this.myTotalReward = []
            this.myTotalStake = []
        })

        // get chain config if epoch is not valid
        if (!chainConfig.epoch) await chainConfig.fetchChainConfig()

        // re-fetch validators
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
            this.validators = sortValidators
            this.isFetchingValidators = false
        })

        return sortValidators
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Actions                                  */
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
        const walletClient = await getWalletClient({ chainId: EXPECT_CHAIN.chainId })
        const publicClient = await getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        if (!walletClient?.account)
            throw new Error(
                '[claimValidatorReward] No wallet client found, Ensure you have conneted your wallet',
            )

        const contract = getContract({
            ...stakingObject,
            walletClient,
        })
        const hash = await contract.write.claimDelegatorFee([validatorAddress], {
            gasPrice: CHAIN_GAS_PRICE[EXPECT_CHAIN.chainNetwork],
            gas: CHAIN_GAS_LIMIT_CUSTOM[EXPECT_CHAIN.chainNetwork].claim,
        })

        const receipt = await publicClient.waitForTransactionReceipt({ hash })

        // update balance, validators, staking history
        await Promise.all([
            chainAccount.fetchBalance(),
            this.updateValidators(),
            this.getMyStakingHistoryLogs(),
        ])

        return receipt
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
    public async stakeToValidator(validatorAddress: Address, amount: number) {
        const walletClient = await getWalletClient({ chainId: EXPECT_CHAIN.chainId })
        const publicClient = await getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        if (!walletClient?.account)
            throw new Error(
                '[stakeToValidator] No wallet client found, Ensure you have conneted your wallet',
            )

        await switchChainWhenIncorrectChain()
        const contract = getContract({ ...stakingObject, walletClient })
        const hash = await contract.write.delegate([validatorAddress], {
            gasPrice: CHAIN_GAS_PRICE[EXPECT_CHAIN.chainNetwork],
            value: parseEther(`${amount}`),
        })

        const receipt = await publicClient.waitForTransactionReceipt({ hash })

        // update balance, validators, staking history
        await Promise.all([
            chainAccount.fetchBalance(),
            this.updateValidators(),
            this.getMyStakingHistoryLogs(),
        ])

        return receipt
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
    public async unstakeFromValidator(validatorAddress: Address, amount: number) {
        const walletClient = await getWalletClient({ chainId: EXPECT_CHAIN.chainId })
        const publicClient = await getPublicClient({ chainId: EXPECT_CHAIN.chainId })

        if (!walletClient?.account)
            throw new Error(
                '[unstakeFromValidator] No wallet client found, Ensure you have conneted your wallet',
            )

        await switchChainWhenIncorrectChain()
        const contract = getContract({ ...stakingObject, walletClient })

        const hash = await contract.write.undelegate([validatorAddress, parseEther(`${amount}`)], {
            value: BigInt(0),
        })

        const receipt = await publicClient.waitForTransactionReceipt({ hash })

        // update balance, validators, staking history
        await Promise.all([
            chainAccount.fetchBalance(),
            this.updateValidators(),
            this.getMyStakingHistoryLogs(),
        ])

        return receipt
    }

    /* -------------------------------------------------------------------------- */
    /*                                 Calculator                                 */
    /* -------------------------------------------------------------------------- */
    /**
     * Calculate validator block reward from giving validator length
     * @remark this function base on old sdk library
     * @param validatorAddress length of validator
     * @returns number of blockreward
     */
    public calcValidatorBlockReward(validatorAmount: number) {
        return parseEther(`${(28800 * 0.6 * 0.603) / validatorAmount}`)
    }

    /**
     * Calculate validator apr from giving validator
     * @remark this function base on old sdk library
     * @param validatorAddress validator address
     * @returns  apr percentage
     */
    public calcValidatorApr(validatorAddress?: Address) {
        if (!validatorAddress) throw new Error('[calcValidatorApr] No `validatorAddress`')

        // find validator in validators store
        const validator = this.validators.find(validator => validator.owner === validatorAddress)
        if (!validator) return 0

        const blockReward = this.calcValidatorBlockReward(this.activeValidator.length)
        const validatorTotalReward = +formatEther(validator.totalRewards + blockReward)
        const validatorTotalStake = +formatEther(validator.totalDelegated)
        const apr = validatorTotalReward / validatorTotalStake
        return 365 * (100 * apr)
    }

    /**
     * Get user staking reward from giving validator address
     * @param validatorAddress validator wallet address
     * @returns reward of user staking
     */
    public async getMyStakingRewards(validatorAddress: Address) {
        const zero = BigInt(0)
        const client = await getPublicClient()
        const wallet = await getWalletClient()
        const staker = wallet?.account.address
        const isInMyTotalReward = this.myTotalReward.find(i => i.validator === validatorAddress)
        const isInMyValidator = this.myValidators.find(i => i === validatorAddress)

        if (!validatorAddress) throw new Error('getMyStakingRewards: No validator address')
        if (!staker) return zero
        if (isInMyTotalReward) return isInMyTotalReward.amount

        const contract = getContract({ ...stakingObject, publicClient: client })
        const reward = await contract.read
            .getDelegatorFee([validatorAddress, staker])
            .catch(() => zero)

        if (reward > zero && !isInMyTotalReward) {
            runInAction(() => {
                this.myTotalReward.push({ validator: validatorAddress, amount: reward })
            })
        }

        if (reward > zero && !isInMyValidator) {
            runInAction(() => {
                this.myValidators.push(validatorAddress)
            })
        }

        return reward
    }

    /**
     * Get user staking amount from giving validator address
     * @param validatorAddress validator wallet address
     * @returns amount of user staking
     */
    public async getMyStakingAmount(validatorAddress?: Address) {
        const zero = BigInt(0)
        const client = await getPublicClient()
        const wallet = await getWalletClient()
        const staker = wallet?.account.address
        const isInMyValidator = this.myValidators.find(i => i === validatorAddress)
        const isInMyTotalStake = this.myTotalStake.find(i => i.validator === validatorAddress)

        if (!validatorAddress) throw new Error('getMyStakingAmount: No validator address')
        if (!staker) return zero
        if (isInMyTotalStake) return isInMyTotalStake.amount

        const contract = getContract({ ...stakingObject, publicClient: client })
        const [amount, atEpoch] = await contract.read
            .getValidatorDelegation([validatorAddress, staker])
            .catch(() => [zero, zero])

        if (amount > zero && !isInMyTotalStake) {
            runInAction(() => {
                this.myTotalStake.push({ validator: validatorAddress, amount: amount })
            })
        }

        if (amount > zero && !isInMyValidator) {
            runInAction(() => {
                this.myValidators.push(validatorAddress)
            })
        }

        return amount
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Getters                                  */
    /* -------------------------------------------------------------------------- */
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
        if (!this.validators) return 0
        const total = this.validators.reduce(
            (total, validator) => total + validator.totalDelegated,
            BigInt(0),
        )
        return Number(formatEther(total))
    }

    get getMyTotalReward() {
        if (!this.myTotalReward) return 0
        const total = this.myTotalReward.reduce(
            (total, validator) => total + validator.amount,
            BigInt(0),
        )
        return Number(formatEther(total))
    }

    get getMyTotalStake() {
        if (!this.myTotalStake) return 0
        const total = this.myTotalStake.reduce(
            (total, validator) => total + validator.amount,
            BigInt(0),
        )
        return Number(formatEther(total))
    }
}
