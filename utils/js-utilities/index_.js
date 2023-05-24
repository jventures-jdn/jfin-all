const lodash = require('lodash')
const yaml = require('js-yaml')
const minimatch = require('minimatch')
const handlebars = require('handlebars')
const isDocker = require('./src/isdocker')
const yamls = require('./src/_yaml')
const checkPort = require('find-free-port-sync')
const isOnline = (...ports) => ports.map(port => checkPort({ port })).every(i => !!i)

module.exports = { _: lodash, yaml, yamls, minimatch, handlebars, isDocker, checkPort, isOnline }
