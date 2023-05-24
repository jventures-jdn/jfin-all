#!/usr/bin/env node

////////////
// A binary command that can be used in other package's script as `run`
// This is an entry point when a package called this binary
////////////

const path = require('path')
const { execSync } = require('child_process')
const [, , ...args] = process.argv

// Figure out source node script (which command to use in template), if first argument begins with `@` then use it.
const sourceNodeScript =
    args.length > 0 && args[0].startsWith('@') ? args[0].slice(1) : process.env.npm_lifecycle_event

// Figure out the project path that initiated the command e.g. apps/app-name
const invokerProjectPath = process.cwd().split(path.sep).slice(-2).join('/')

// Filter variables
const varArgs = args.filter(a => a.startsWith('*')).map(b => b.slice(1))

// Filter the rest (to append on final command)
const appendArgs = args.filter(a => !a.startsWith('@') && !a.startsWith('*'))

// Then forward the call to command handler with `ts-node`
const command = [
    'pnpm',
    'ts-node --transpileOnly',
    './src/command-handler',
    invokerProjectPath,
    sourceNodeScript,
    varArgs.length > 0 ? varArgs.join(',') : '_',
    appendArgs.length > 0 ? appendArgs.join(',') : '_',
].join(' ')
execSync(command, { stdio: 'inherit', cwd: `${__dirname}/..` })
