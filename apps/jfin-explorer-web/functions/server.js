// server.js
const admin = require('firebase-admin')
admin.initializeApp()

// prepare next app
const next = require('next')
const nextApp = next({
    dev: false,
    conf: { distDir: '.next' },
})
const handle = nextApp.getRequestHandler()

// prepare env
const functions = require('firebase-functions')
const deploymentNetwork = functions.config().deployment.network
if (!deploymentNetwork) throw Error('deployment.network config is required')

// setup function
const nextServer = functions.region('asia-southeast1').https.onRequest((request, response) => {
    return nextApp.prepare().then(() => handle(request, response))
})

exports.nextjs = {
    server: {
        explorer: {
            [deploymentNetwork]: nextServer,
        },
    },
}
