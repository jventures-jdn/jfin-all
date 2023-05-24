import { cryptos } from '..'

describe('crypto', () => {
    test('base64 encode/decode', async () => {
        const data = 'Hello, World!'
        const encoded = cryptos.base64Encode(data)
        const decoded = cryptos.base64Decode(encoded)
        expect(data).toBe(decoded)
    })

    test('random hex', async () => {
        const hex = cryptos.randomHex(8)
        expect(hex).toHaveLength(16)
    })

    test('random string', async () => {
        const str = cryptos.randomString(8)
        expect(str).toHaveLength(11)
    })

    test('rsa signing', async () => {
        const message = 'Hello, World!'
        const { publicKey, privateKey } = cryptos.generateRSAKeyPair()
        const signature = cryptos.sign(message, privateKey)
        expect(signature).toBeTruthy()
        const verified = cryptos.verify(message, publicKey, signature)
        expect(verified).toBe(true)
    })

    test('hash md5', async () => {
        const data = 'Hello, World!'
        const hashed = cryptos.hashMd5(data)
        expect(hashed).toBeTruthy()
    })
})
