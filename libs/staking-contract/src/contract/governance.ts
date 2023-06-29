import { action, makeObservable, observable, runInAction } from 'mobx'
import { governanceObject } from '.'
import { getPublicClient } from 'wagmi/actions'
import { EXPECT_CHAIN } from '@utils/chain-config'
import { getAbiItem, getContract } from 'viem'

export class Governance {
    constructor() {
        makeObservable(this, {
            proposals: observable,
            getProposals: action,
        })
    }

    /* ------------------------------- Propperties ------------------------------ */
    public proposals: Awaited<ReturnType<typeof this.getProposals>>

    /* --------------------------------- Methods -------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                   Actions                                  */
    /* -------------------------------------------------------------------------- */
    public async addDeployer() {}
    public async removeDeployer() {}
    public async addValidator() {}
    public async removeValidator() {}
    public async activateValidator() {}
    public async disableValidator() {}
    public async upgradeRuntime() {}

    /* -------------------------------------------------------------------------- */
    /*                                   Fetcher                                  */
    /* -------------------------------------------------------------------------- */
    public async getProposals() {
        const [createdLogs] = await Promise.all([this.getProposalCreatedLogs()])

        runInAction(() => {
            this.proposals = createdLogs
        })

        return createdLogs
    }
    public async getVotingPowers() {}

    /* -------------------------------------------------------------------------- */
    /*                                    Logs                                    */
    /* -------------------------------------------------------------------------- */

    /**
     * Get `ProposalCreated` logs from giving `proposalId` with earliest to latest block
     * @param proposalId
     * @returns logs of proposal state
     */
    private async getProposalStateLogs(proposalId: bigint) {
        const publicClient = getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        const contract = getContract({ ...governanceObject, publicClient })
        return await contract.read.state([proposalId])
    }

    public async getProposalCreatedLogs() {
        const client = getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        const contract = getContract(governanceObject)
        const abiItem = getAbiItem({ abi: contract.abi, name: 'ProposalCreated' })

        const logs = await client.getLogs({
            event: abiItem,
            fromBlock: 'earliest',
            toBlock: 'latest',
        })

        return logs
    }

    /**
     * Get `VoteCastWithParams` logs from earliest to latest block
     * @returns logs of VoteCastWithParams
     */
    public async getProposalCastVoteLogs() {
        const client = getPublicClient({ chainId: EXPECT_CHAIN.chainId })
        const contract = getContract(governanceObject)
        const abiVoteCast = getAbiItem({ abi: contract.abi, name: 'VoteCast' })
        const abiVoteCastWithParams = getAbiItem({ abi: contract.abi, name: 'VoteCastWithParams' })

        const [vote, voteParams] = await Promise.all([
            client.getLogs({
                event: abiVoteCast,
                fromBlock: 'earliest',
                toBlock: 'latest',
            }),
            client.getLogs({
                event: abiVoteCastWithParams,
                fromBlock: 'earliest',
                toBlock: 'latest',
            }),
        ])

        // sort data
        const proposalVoteLogs = [...vote, ...voteParams].sort(
            (prev, curr) => Number(curr.blockNumber) - Number(prev.blockNumber),
        )

        // mapping wording
        const proposalVotes = proposalVoteLogs.map(log => {
            let voteType = 'ABSTAIN'

            switch (log.args.support) {
                case 0:
                    voteType = 'AGAINST'
                    break
                case 1:
                    voteType = 'FOR'
                    break
            }

            return { ...log, values: { ...log.args, voteType } }
        })

        return proposalVotes
    }
}
