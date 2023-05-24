import { execSync } from 'child_process'
import { GlobalConfig } from '@utils/global-config'
const { load } = require('@utils/global-config/index_')

const [, , ...args] = process.argv
const channel = args.find(arg => arg.startsWith('channel='))?.split('channel=')[1]

// Load global config to process env
load(true)

if (GlobalConfig.target().mode === 'prod' && channel) {
    console.warn('🚧 channel deployment not yet supported in production')
    process.exit()
}

// Obtain deployment options
const { projectId, region } = GlobalConfig.deployment()
if (!projectId || !region) throw Error('⛔ gcloud projectId or region not found in .config.yaml')

// Prepare cloud run service name and service account id
const baseServiceName =
    GlobalConfig.shortTarget() === 'prod'
        ? process.env.SHORT_NAME!.substring(0, 49)
        : `${GlobalConfig.shortTarget()}--${process.env.SHORT_NAME}`.substring(0, 49) // max size for cloud run = 49
const serviceAccountId = baseServiceName.substring(0, 30) // max size for service account = 30
const serviceName = `${channel ? `${channel}-` : ''}${baseServiceName}`

const deploymentLogMessage = [
    '🚀 Deploying...',
    `\x1b[36m${process.env.PACKAGE_NAME}\x1b[0m`,
    '>',
    `[type \x1b[31m${process.env.APP_TYPE}\x1b[0m]`,
    '>',
    `[target \x1b[32m${process.env.TARGET}\x1b[0m]`,
]
if (channel) {
    deploymentLogMessage.push('>')
    deploymentLogMessage.push(`[channel \x1b[35m${channel}\x1b[0m]`)
}

console.log(...deploymentLogMessage)
console.log(
    '🌏 [Google Cloud] project',
    `\x1b[32m'${projectId}'\x1b[0m`,
    '|',
    'region',
    `\x1b[32m'${region}'\x1b[0m`,
    '|',
    'service',
    `\x1b[35m${channel ? `${channel}-` : ''}\x1b[32m${baseServiceName}'\x1b[0m`,
)

console.log('🔎 Checking service account...\x1b[33m', serviceAccountId, '\x1b[0m')
const existingSAs = JSON.parse(
    execSync(
        `gcloud iam service-accounts list --filter ${serviceAccountId}@${projectId}.iam.gserviceaccount.com --format json --project ${projectId}`,
    ).toString(),
)

let serviceAccountEmail: string
if (existingSAs.length === 0) {
    console.log('✨ Creating service account...')
    const displayName = `${process.env.PACKAGE_NAME} (${process.env.TARGET})`
    const newSA = JSON.parse(
        execSync(
            `gcloud iam service-accounts create ${serviceAccountId} --display-name "${displayName}" --format json --project ${projectId}`,
        ).toString(),
    )
    console.log('✅ Service account ready:\x1b[32m', newSA.email, '\x1b[0m')
    serviceAccountEmail = newSA.email
} else {
    if (existingSAs[0].disabled) throw Error(`Service account disabled ${existingSAs[0].email}`)
    console.log('✅ Service account ready:\x1b[32m', existingSAs[0].email, '\x1b[0m')
    serviceAccountEmail = existingSAs[0].email
}

const substitutions = {
    _DOCKER_FILE: `core/docker/docker-files/${
        process.env.DOCKER_FILE || process.env.APP_TYPE
    }/Dockerfile`,
    _SERVICE_ACCOUNT: serviceAccountEmail,
    _REGION: region,
    _TARGET: process.env.TARGET,
    _PACKAGE_NAME: process.env.PACKAGE_NAME,
    _SHORT_NAME: process.env.SHORT_NAME,
    _APP_FOLDER: process.env.APP_FOLDER,
    _SERVICE_NAME: serviceName,
}
console.log('🌩️ [cloudbuild]')
console.log(substitutions)

// TODO: turbo prune target project

const gcloudBuildCommand = [
    'gcloud builds submit ../../',
    '--config',
    '../../core/gcloud/cloudbuild.yml',
    '--substitutions',
    Object.entries(substitutions)
        .map(([key, value]) => `${key}=${value}`)
        .join(','),
    '--project',
    projectId,
].join(' ')
console.log('🚥\x1b[33m', gcloudBuildCommand, '\x1b[0m')

execSync(gcloudBuildCommand, { stdio: 'inherit' })

console.log('✅ Deployed')
