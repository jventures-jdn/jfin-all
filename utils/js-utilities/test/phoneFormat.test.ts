import { PhoneFormat } from '../src/phoneFormat'

describe.only('PhoneFormat', () => {
    describe.only('Valid test send phone number', () => {
        test('phone number thai', async () => {
            const phoneString = ['0925915195', '0640300162', '0966802273']
            for (const element of phoneString) {
                const phone = new PhoneFormat(element)
                expect(phone.isValid).toBe(true)
            }
        })

        test('phone number not thai', async () => {
            const phoneString = ['+66655550100', '+66600031000', '+66800031000', '+66900031000']
            for (const element of phoneString) {
                const phone = new PhoneFormat(element)
                expect(phone.isValid).toBe(true)
            }
        })
    })

    describe.only('Invalid test send phone number', () => {
        test('not format phone number', () => {
            const phoneString: any = [
                ,
                '0.1',
                ' ',
                '-0',
                '092591',
                'df',
                'dferf445k9',
                '12345678901',
                '12ww56กหr9',
            ]
            for (const element of phoneString) {
                expect(() => {
                    new PhoneFormat(element)
                }).toThrow()
            }
        })
    })
})
