import * as lodash from 'lodash'
import * as yaml from 'js-yaml'
import * as handlebars from 'handlebars'
import * as pako from 'pako'
import * as jwt from 'jsonwebtoken'
import { Utilities } from './src/utilities'
import { CryptoUtilities } from './src/crypto'
import { FileUtilities } from './src/file'
import { NumberUtilities } from './src/number'
import { StringUtilities } from './src/string'
import { ArrayUtilities } from './src/array'
import { YamlUtilities } from './src/yaml'
import { PhoneFormat } from './src/phoneFormat'
import { PaginationHelper, Pagination } from './src/pagination-helper'
const isDocker = require('./src/isdocker')
const minimatch = require('minimatch')
const ipfsHash = require('ipfs-only-hash')

export {
    Utilities as utils,
    CryptoUtilities as cryptos,
    FileUtilities as files,
    NumberUtilities as numbers,
    StringUtilities as strings,
    ArrayUtilities as arrays,
    YamlUtilities as yamls,
    PhoneFormat,
    PaginationHelper,
    lodash as _,
    yaml,
    minimatch,
    handlebars,
    isDocker,
    ipfsHash,
    pako,
    jwt,
}

export type { Pagination }
