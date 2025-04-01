import { action, computed, has, makeObservable, observable, runInAction } from 'mobx'
import { Validator, stakingObject } from '.'
import { Address } from 'abitype'
import {
    EXPECT_CHAIN,
    VALIDATOR_STATUS_ENUM,
    CHAIN_GAS_PRICE,
    CHAIN_GAS_LIMIT_CUSTOM,
    VALIDATOR_STATUS_MAPPING,
} from '@utils/chain-config'
import { getWalletClient, getPublicClient } from 'wagmi/actions'
import { chainConfig } from '.'
import { BaseError, formatEther, getAbiItem, getContract, parseEther } from 'viem'
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
    public walletTimeout = 15000
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
     * Get `Delegated` logs from giving staker address and validator add with earliest to latest block
     * - When giving staker address will return logs of specific staker address in all validators.
     * - When giving validator address will return logs of specific validator in all staker.
     * - When giving both staker and validator address will return logs from specific staker and validator address
     * @param {address} staker - The staker address
     * @param {address} validator - The validator address
     * @returns `Delegated` logs
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
     * Get `Undelegated` logs from giving staker address and validator add with earliest to latest block
     * - When giving staker address will return logs of specific staker address in all validators.
     * - When giving validator address will return logs of specific validator in all staker.
     * - When giving both staker and validator address will return logs from specific staker and validator address
     * @param {address} staker - The staker address
     * @param {address} validator - The validator address
     * @returns `Undelegated` logs
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
     * Get `Claimed` logs from giving staker address and validator add with earliest to latest block
     * - When giving staker address will return events of specific staker address in all validators.
     * - When giving validator address will return events of specific validator in all staker.
     * - When giving both staker and validator address will return events from specific staker and validator address
     * @param {address} staker - The staker address
     * @param {address} validator - The validator address
     * @returns `Claimed` logs
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
     * Get user staking history logs, included stake, unstake, claim logs
     * - this function clear `myStakingHistoryLogs` before fetch logs
     * - logs will be update to `myStakingHistoryLogs` after fetch finished
     * - logs will be sort by block number
     * @returns staking history logs
     */
    public async getMyStakingHistoryLogs() {
        runInAction(() => {
            this.myStakingHistoryLogs = [] // clear events
        })

        const walletClient = await getWalletClient({ chainId: EXPECT_CHAIN.chainId })
        if (!walletClient) return

        const [stake, unstake, claim] = await Promise.all([
            this.getStakeLogs(walletClient.account.address),
            this.getUnStakeLogs(walletClient.account.address),
            this.getClaimLogs(walletClient.account.address),
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
     * Get `ValidatorAdded` logs from earliest to latest block
     * @returns `ValidatorAdded` logs
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
     * Get `ValidatorRemoved` logs from earliest to latest block
     * @returns `ValidatorRemoved` logs
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
     * Get `ValidatorJailed` logs from earliest to latest block
     * @returns `ValidatorJailed` logs
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
     * Get available validators logs
     * @returns validators logs
     */
    public async getValidatorLogs() {
        const [addedValidators, removedValidators] = await Promise.all([
            this.getAddedValidatorLogs(),
            this.getRemovedValidatorLogs(),
        ])

        const availableValidators = addedValidators.filter(
            i => !removedValidators.find(r => i.args.validator === r.args.validator),
        )

        this.validatorLogs = availableValidators

        return availableValidators
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Fetcher                                  */
    /* -------------------------------------------------------------------------- */

    /**
     * Fetch validator information from giving validator log and epoch
     * - this function will fetch `getMyStakingRewards` and `getMyStakingAmount` during fetching
     * @returns Mixed of validator logs and information
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
     * Fetch all validators in network
     * - this function will update `isFetchingValidators` and `isReady`
     * - this function will update `validators` after fetch finished
     * - validator will be sort by block number
     * @returns List of mixed validator logs and validator information
     */
    public async fetchValidators() {
        runInAction(() => {
            this.isFetchingValidators = true
        })

        // parallel fetch validator
        const epoch = chainConfig.epoch
        const validatorLogs = await this.getValidatorLogs()

        console.log('validatorLogs', validatorLogs)
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

    /**
     * Update validators
     * - this function will clear `myValidators`, `myTotalReward`, `myTotalStake` before start
     * - this function will fetch `fetchChainConfig` if `epoch` is not valid
     * - this function will update `isFetchingValidators` and `isReady`
     * - this function will update `validators` after fetch finished
     * - validator will be sort by block number
     * @returns List of mixed validator logs and validator information
     */
    public async updateValidators() {
        if (!this.validatorLogs?.length) {
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
     * Claim reward from giving validator address
     * - this function have time limit and will be throw error if contract not throw anything and time over 15s
     * - if contract throw any resolve or reject limit time will be clear
     * - this function will be call `updateValidators()` and `getMyStakingHistoryLogs()` when finished
     * @param validatorAddress validator address
     * @returns transaction receipt
     */
    public async claimValidatorReward(validatorAddress: Address) {
        let timer: NodeJS.Timeout | undefined = undefined
        await switchChainWhenIncorrectChain()

        const walletClient = await getWalletClient({ chainId: EXPECT_CHAIN.chainId })
        const publicClient = await getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        if (!walletClient?.account)
            throw new Error(
                '[claimValidatorReward] No wallet client found, Ensure you have conneted your wallet',
            )

        const contract = getContract({ ...stakingObject, walletClient })

        try {
            const execute: Promise<Address> = new Promise((resolve, reject) => {
                return contract.write
                    .claimDelegatorFee([validatorAddress], {
                        gasPrice: CHAIN_GAS_PRICE[EXPECT_CHAIN.chainNetwork],
                        gas: CHAIN_GAS_LIMIT_CUSTOM[EXPECT_CHAIN.chainNetwork].claim,
                    })
                    .then(hash => resolve(hash))
                    .catch(e => reject(e as BaseError))
            })
            const timeout: Promise<BaseError> = new Promise(reject => {
                timer = setTimeout(() => {
                    reject(new BaseError(`An unknown RPC error occurred.`))
                }, this.walletTimeout)
            })

            // execute with litmit timeout, if over limit throw error
            const hash = await Promise.race([execute, timeout])
            if (hash instanceof BaseError) throw hash

            // wait for transaction
            const receipt = await publicClient.waitForTransactionReceipt({ hash })

            // update balance, validators, staking history
            await Promise.all([this.updateValidators(), this.getMyStakingHistoryLogs()])

            return receipt
        } catch (e: any) {
            // clear timeout
            if (timer) clearTimeout(timer)

            // check is error `An unknown RPC error occurred`
            const err: BaseError = e
            const isUnknownRpc = err.shortMessage === `An unknown RPC error occurred.`
            if (isUnknownRpc)
                throw new Error(
                    `Wallet connection timeout, This might be your website network and your wallet are inconsistent, Please switch your wallet network to [${EXPECT_CHAIN.chainName}] manully.`,
                )

            // throw original error to outside
            throw e
        }
    }

    /**
     * Stake amount of token to giving validator address
     * - this function have time limit and will be throw error if contract not throw anything and time over 15s
     * - if contract throw any resolve or reject limit time will be clear
     * - this function will be call `updateValidators()` and `getMyStakingHistoryLogs()` when finished
     * @param validatorAddress validator address
     * @param amount amount of token to stake
     * @returns transaction receipt
     */
    public async stakeToValidator(validatorAddress: Address, amount: number) {
        let timer: NodeJS.Timeout | undefined = undefined
        await switchChainWhenIncorrectChain()

        const walletClient = await getWalletClient({ chainId: EXPECT_CHAIN.chainId })
        const publicClient = await getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        if (!walletClient?.account)
            throw new Error(
                '[stakeToValidator] No wallet client found, Ensure you have conneted your wallet',
            )

        const contract = getContract({ ...stakingObject, walletClient })

        try {
            const execute: Promise<Address> = new Promise((resolve, reject) => {
                return contract.write
                    .delegate([validatorAddress], {
                        gas: CHAIN_GAS_LIMIT_CUSTOM[EXPECT_CHAIN.chainNetwork].stake,
                        gasPrice: CHAIN_GAS_PRICE[EXPECT_CHAIN.chainNetwork],
                        value: parseEther(`${amount}`),
                    })
                    .then(hash => resolve(hash))
                    .catch(e => reject(e as BaseError))
            })
            const timeout: Promise<BaseError> = new Promise(reject => {
                timer = setTimeout(() => {
                    reject(new BaseError(`An unknown RPC error occurred.`))
                }, this.walletTimeout)
            })

            // execute with litmit timeout, if over limit throw error
            const hash = await Promise.race([execute, timeout])
            if (hash instanceof BaseError) throw hash

            // wait for transaction
            const receipt = await publicClient.waitForTransactionReceipt({ hash })

            // update balance, validators, staking history
            await Promise.all([this.updateValidators(), this.getMyStakingHistoryLogs()])

            return receipt
        } catch (e: any) {
            // clear timeout
            if (timer) clearTimeout(timer)

            // check is error `An unknown RPC error occurred`
            const err: BaseError = e
            const isUnknownRpc = err.shortMessage === `An unknown RPC error occurred.`
            if (isUnknownRpc)
                throw new Error(
                    `Wallet connection timeout, This might be your website network and your wallet are inconsistent, Please switch your wallet network to [${EXPECT_CHAIN.chainName}] manully.`,
                )

            // throw original error to outside
            throw e
        }
    }

    /**
     * Un-Stake amount of token from giving validator address
     * - this function have time limit and will be throw error if contract not throw anything and time over 15s
     * - if contract throw any resolve or reject limit time will be clear
     * - this function will be call `updateValidators()` and `getMyStakingHistoryLogs()` when finished
     * @param validatorAddress validator address
     * @param amount amount of token to un-stake
     * @returns transaction receipt
     */
    public async unstakeFromValidator(validatorAddress: Address, amount: number) {
        let timer: NodeJS.Timeout | undefined = undefined
        await switchChainWhenIncorrectChain()

        const walletClient = await getWalletClient({ chainId: EXPECT_CHAIN.chainId })
        const publicClient = await getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        if (!walletClient?.account)
            throw new Error(
                '[unstakeFromValidator] No wallet client found, Ensure you have conneted your wallet',
            )

        const contract = getContract({ ...stakingObject, walletClient })

        try {
            const execute: Promise<Address> = new Promise((resolve, reject) => {
                return contract.write
                    .undelegate([validatorAddress, parseEther(`${amount}`)], {
                        gas: CHAIN_GAS_LIMIT_CUSTOM[EXPECT_CHAIN.chainNetwork].stake,
                        value: BigInt(0),
                    })
                    .then(hash => resolve(hash))
                    .catch(e => reject(e as BaseError))
            })
            const timeout: Promise<BaseError> = new Promise(reject => {
                timer = setTimeout(() => {
                    reject(new BaseError(`An unknown RPC error occurred.`))
                }, this.walletTimeout)
            })

            // execute with litmit timeout, if over limit throw error
            const hash = await Promise.race([execute, timeout])
            if (hash instanceof BaseError) throw hash

            // wait for transaction
            const receipt = await publicClient.waitForTransactionReceipt({ hash })

            // update balance, validators, staking history
            await Promise.all([this.updateValidators(), this.getMyStakingHistoryLogs()])

            return receipt
        } catch (e: any) {
            // clear timeout
            if (timer) clearTimeout(timer)

            // check is error `An unknown RPC error occurred`
            const err: BaseError = e
            const isUnknownRpc = err.shortMessage === `An unknown RPC error occurred.`
            if (isUnknownRpc)
                throw new Error(
                    `Wallet connection timeout, This might be your website network and your wallet are inconsistent, Please switch your wallet network to [${EXPECT_CHAIN.chainName}] manully.`,
                )

            // throw original error to outside
            throw e
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                 Calculator                                 */
    /* -------------------------------------------------------------------------- */
    /**
     * Calculate validator block reward from giving validator amount
     * @remark this function base on old sdk library
     * @param validatorAmount amount of validator
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
            .catch(() => BigInt(-1))
        const isReverted = reward === BigInt(-1)

        if (reward > zero && !isInMyTotalReward && !isReverted) {
            runInAction(() => {
                this.myTotalReward.push({ validator: validatorAddress, amount: reward })
            })
        }

        if (reward > zero && !isInMyValidator && !isReverted) {
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
            return [VALIDATOR_STATUS_ENUM.ACTIVE, VALIDATOR_STATUS_ENUM.PENDING].includes(
                validator.status,
            )
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
