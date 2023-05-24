import * as _ from 'lodash'

export class StringUtilities {
    static indent(value: string, space: number, character = ' ') {
        let _space = ''
        for (let i = 0; i < space; i++) _space += character || ' '
        return value
            .split('\n')
            .map(line => _space + line)
            .join('\n')
    }

    static isEmptyOrWhitespace(value: string) {
        return value.trim().length === 0
    }

    static isNotEmptyString(value?: any) {
        if (typeof value === 'string') {
            return !this.isEmptyOrWhitespace(value)
        } else {
            return _.isString(value) && !_.isEmpty(value)
        }
    }

    static isNotEmptyStringMany(value: any[]) {
        return value.every(i => this.isNotEmptyString(i))
    }

    static isNotEmptyStringNullable(value?: any) {
        if (value === undefined || value === null) return true
        else return this.isNotEmptyString(value)
    }
}
