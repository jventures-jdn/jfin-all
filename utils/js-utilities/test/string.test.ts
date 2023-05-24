import { strings } from '..'

describe('string', () => {
    test('isNotEmptyString', async () => {
        expect(strings.isNotEmptyString(null)).toBe(false)
        expect(strings.isNotEmptyString(undefined)).toBe(false)
        expect(strings.isNotEmptyString(0)).toBe(false)
        expect(strings.isNotEmptyString(1)).toBe(false)
        expect(strings.isNotEmptyString([])).toBe(false)
        expect(strings.isNotEmptyString([1])).toBe(false)
        expect(strings.isNotEmptyString('')).toBe(false)
        expect(strings.isNotEmptyString(' ')).toBe(false)
        expect(strings.isNotEmptyString('1')).toBe(true)
    })

    test('isNotEmptyStringMany', async () => {
        expect(strings.isNotEmptyStringMany([null, undefined, 0, 1, [], [1], ''])).toBe(false)
        expect(strings.isNotEmptyStringMany(['1'])).toBe(true)
    })

    test('isNotEmptyStringNullable', async () => {
        expect(strings.isNotEmptyStringNullable(null)).toBe(true)
        expect(strings.isNotEmptyStringNullable(undefined)).toBe(true)
        expect(strings.isNotEmptyStringNullable(0)).toBe(false)
        expect(strings.isNotEmptyStringNullable(1)).toBe(false)
        expect(strings.isNotEmptyStringNullable([])).toBe(false)
        expect(strings.isNotEmptyStringNullable([1])).toBe(false)
        expect(strings.isNotEmptyStringNullable('')).toBe(false)
        expect(strings.isNotEmptyStringNullable('1')).toBe(true)
    })
})
