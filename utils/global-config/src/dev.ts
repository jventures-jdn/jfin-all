import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { yaml, _, cryptos, isDocker } from '@utils/js-utilities'
import defaultConfig from './default'

export class GlobalConfigDev {
    static readonly globalConfigPath = path.join(process.cwd(), `../../.config.yaml`)

    // at dev/build time, construct `.config.yaml` by merging existing (if any) with default and system()
    // `ignoreDefault` to only update system()
    static sync(ignoreDefault?: boolean) {
        // load existing global config file `.config.yaml`
        const exists = fs.existsSync(this.globalConfigPath)
        const existingContent = exists && fs.readFileSync(this.globalConfigPath).toString()
        const existingConfig = existingContent && yaml.load(existingContent)

        // merge existing (if exists) with the default config
        const shouldReplace = (obj: any) => !_.isObjectLike(obj) || _.isArray(obj)
        let mergedConfig = ignoreDefault
            ? existingConfig || {}
            : existingConfig
            ? _.mergeWith(
                  existingConfig,
                  defaultConfig,
                  (existingValue: any, replacingValue: any) => {
                      if (shouldReplace(existingValue) && shouldReplace(replacingValue)) {
                          // using existing value if already present (not overriding by default value)
                          // otherwise, use default value
                          return !!existingValue ? existingValue : replacingValue
                      }
                  },
              )
            : defaultConfig

        // generate local keypair (into default config) for dev
        if (!ignoreDefault && !_.get(mergedConfig, `target.development.dev.iam.privateKey`)) {
            const keyPair = cryptos.generateRSAKeyPair()
            _.set(mergedConfig, `target.development.dev.iam.publicKey`, keyPair.publicKey)
            _.set(mergedConfig, `target.development.dev.iam.privateKey`, keyPair.privateKey)
        }

        // merge with dynamic values e.g. git info
        mergedConfig = _.mergeWith(mergedConfig, this.system(), (a, b) =>
            // replace whole object
            _.isObjectLike(b) ? b : undefined,
        )

        // overwrite merged config to `.config.yaml`
        const mergedYaml = yaml.dump(mergedConfig)
        fs.writeFileSync(this.globalConfigPath, mergedYaml)

        // inform with `.config.yaml` is just created
        if (!exists)
            console.log(
                '✅ \x1b[34m.config.yaml\x1b[0m is just auto generated under root directory',
            )
        else console.log('✅ \x1b[34m.config.yaml\x1b[0m synced')
    }

    /** For local docker */
    static copyLocalConfigFileTo(filename: string) {
        const toConfigPath = path.join(process.cwd(), `../../.${filename}.yaml`)
        fs.copyFileSync(this.globalConfigPath, toConfigPath)
    }

    /** For deployment */
    static createDefaultConfigFile(target = process.env.TARGET, filename: string) {
        let config = _.cloneDeep(defaultConfig)

        // merge with dynamic values e.g. git info
        config = _.mergeWith(config, this.system(), (a, b) =>
            // replace whole object
            _.isObjectLike(b) ? b : undefined,
        )

        // filter unused config
        config = this.filter(config, target)

        // overwrite merged config to `{target}.yaml`
        const configPath = path.join(process.cwd(), `../../.${filename}.yaml`)
        const configYaml = yaml.dump(config)
        fs.writeFileSync(configPath, configYaml)
    }

    static deleteConfigFile(filename: string) {
        const configPath = path.join(process.cwd(), `../../.${filename}.yaml`)
        if (fs.existsSync(configPath)) fs.rmSync(configPath)
    }

    /** filter unused config that's not under target */
    static filter(data: any, target = process.env.TARGET) {
        const result = _.cloneDeep(data)
        Object.keys(result.target).forEach(t => {
            if (t === target) {
                const deployment = result.target[t].deployment
                Object.keys(result.deployment).forEach(d => {
                    if (d !== deployment) delete result.deployment[d]
                })
                const databases = Object.values(result.target[t].database)
                Object.keys(result.database).forEach(d => {
                    if (!databases.includes(d)) delete result.database[d]
                })
            } else {
                delete result.target[t]
            }
        })
        return result
    }

    // gather system information
    static system() {
        let git: ReturnType<typeof this.git> | undefined = undefined
        if (typeof window === 'undefined') {
            // git command might not exist (e.g. docker, nextjs client)
            try {
                const { execSync } = require('child_process')
                git = this.git(execSync)
            } catch {
            } finally {
                if (git?.changes && git?.changes?.length === 0) delete git.changes
            }
        }
        return {
            docker: isDocker(),
            // git info
            git,
            // host info
            host: {
                name: os.hostname(),
                type: os.type(),
                platform: os.platform(),
                release: os.arch(),
            },
            // time
            time: {
                unix: Math.floor(Date.now() / 1000),
                iso: new Date().toISOString(),
                zone: (new Date().getTimezoneOffset() / 60) * -1,
                local: new Date().toLocaleString(),
            },
        }
    }

    // gather git information
    private static git(execSync: Function) {
        return {
            branch: execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
            message: execSync('git log -1 --pretty=format:%B')
                .toString()
                .trim()
                .replace(/["']/g, '')
                .replace(/[\r\n]+/g, '\n'),
            sha: execSync('git rev-parse HEAD').toString().trim(),
            shortSha: execSync('git rev-parse --short HEAD').toString().trim(),
            author: execSync(`git log --format='%ae' HEAD^!`).toString().trim(),
            changes: execSync('git status --porcelain')
                .toString()
                .trim()
                .split('\n')
                .map((i: any) => i.trim())
                .filter((i: any) => !!i),
        }
    }
}
