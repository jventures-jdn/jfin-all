import { GlobalConfigFormat } from './types'
import { yaml, yamls, utils, _ } from '@utils/js-utilities'

export class GlobalConfig {
    private static instance?: GlobalConfigFormat
    private static maskedPaths?: string[]
    private static masked?: any

    // at runtime, get full config from `process.env.GLOBAL_CONFIG`
    // and auto merge with all `process.env.VAULT_CONFIG*`
    static get(options?: { unmasked: boolean }): GlobalConfigFormat {
        // only load once per process
        if (!!this.instance) return options?.unmasked ? this.instance : this.masked

        if (process.env.GLOBAL_CONFIG) {
            this.maskedPaths = []
            let globalConfigEnv = yamls.unminify(process.env.GLOBAL_CONFIG) as GlobalConfigFormat
            delete process.env.GLOBAL_CONFIG

            // merge with all vault config (secrets) provided at cloud instance
            Object.keys(process.env)
                .filter(e => e.startsWith('VAULT_CONFIG'))
                .forEach(vaultConfigEnv => {
                    const vaultGlobalConfig = yaml.load(process.env[vaultConfigEnv]!) as any
                    delete process.env[vaultConfigEnv]
                    // update global config
                    globalConfigEnv = _.merge(globalConfigEnv, vaultGlobalConfig)
                    // update masked paths
                    this.maskedPaths = [...this.maskedPaths!, ...utils.getPaths(vaultGlobalConfig)]
                })

            this.instance = globalConfigEnv
            this.masked = utils.setPaths(
                _.cloneDeep(this.instance),
                this.maskedPaths.map(path => ({ path, value: '**' })),
            )
            return this.get(options)
        }

        throw Error('Global config not found')
    }

    // pick any path using dots format
    static pick(path: string, options?: { unmasked: boolean }) {
        return _.get(this.get(options), path)!
    }

    // shortcut to target settings
    static target(target = process.env.TARGET, options?: { unmasked: boolean }) {
        return this.pick(`target.${target}`, options)
    }

    // shortcut to blockchain settings
    static blockchain(blockchain?: string, network?: string, options?: { unmasked: boolean }) {
        if (!blockchain && !network) {
            const target = this.target()
            blockchain = target.blockchain
            network = target.network
        }
        return this.pick(
            `blockchain.${blockchain}.${network}`,
            options,
        ) as GlobalConfigFormat['blockchain']['jfin']['mainnet']
    }

    // get list of blockchain without nested
    static blockchains() {
        const networks = this.pick('blockchain') as GlobalConfigFormat['blockchain']
        return Object.entries(networks).reduce((prev, [, subNetworks]) => {
            const chains = Object.entries(subNetworks as any).reduce((prev, [, chain]) => {
                Object.keys(chain as any).length &&
                    prev.push(chain as GlobalConfigFormat['blockchain']['jfin']['mainnet'])
                return prev
            }, [] as GlobalConfigFormat['blockchain']['jfin']['mainnet'][])
            return prev.concat(chains)
        }, [] as GlobalConfigFormat['blockchain']['jfin']['mainnet'][])
    }

    // shortcut to database settings
    static database(cluster: string, options?: { unmasked: boolean }, target = process.env.TARGET) {
        const targetCluster = _.get((this.target(target, options) as any).database, cluster)
        const targetDatabase = this.pick(`database.${targetCluster}`, options)
        const { dbName, connectionString } = targetDatabase || {}
        return { dbName, connectionString }
    }

    // shortcut to git settings
    static git(options?: { unmasked: boolean }) {
        return this.pick(`git`, options) as GlobalConfigFormat['git']
    }

    // shortcut to get deployment options
    static deployment(target = process.env.TARGET) {
        const deploymentId = this.target(target).deployment
        const projectId = this.pick(`deployment.${deploymentId}.projectId`)
        const region = this.pick(`deployment.${deploymentId}.region`)
        const assetBucket = this.pick(`deployment.${deploymentId}.assetBucket`)
        return { projectId, region, assetBucket }
    }

    // shortcut to pubsub settings (topic names)
    static pubsub(topic: string, target = process.env.TARGET) {
        const pubsubid = (this.target(target) as any).pubsub
        return this.pick(`pubsub.${pubsubid}.${topic}`)
    }

    static kms(target = process.env.TARGET) {
        const kms = (this.target(target) as any).kms
        const iam = this.pick(`iam.kms.${kms.iam}`)
        return { iam }
    }

    static endpoint(key: string, target = process.env.TARGET) {
        const endpoint = this.target(target).endpoints
        const endpoints = this.pick(`endpoints.${endpoint}`)
        return endpoints[key]
    }

    static shortTarget(target = process.env.TARGET) {
        return (
            this.target(target).abbrev ||
            target
                ?.split('_')
                .join('-')
                .split('-')
                .map(i => i.substring(0, 4))
                .join('')
        )
    }
}
