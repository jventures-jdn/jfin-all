import * as crypto from 'crypto'

export class CryptoUtilities {
    static randomHex(sizeInBytes: number = 8, capitalized?: boolean) {
        let result = crypto.randomBytes(sizeInBytes).toString('hex')
        if (capitalized) result = result.toUpperCase()
        return result
    }

    static randomString(sizeInBytes: number = 8) {
        return crypto.randomBytes(sizeInBytes).toString('base64url')
    }

    static randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    static hashMd5(data: string) {
        return crypto.createHash('md5').update(data).digest('hex')
    }

    static base64Encode(data: string | any) {
        return Buffer.from(data).toString('base64')
    }

    static base64Decode(data: string | any) {
        return Buffer.from(data, 'base64').toString()
    }

    static base64DecodeToAny(data: string | any) {
        return Buffer.from(data, 'base64')
    }

    static generateRSAKeyPair(modulusLength = 2048) {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: modulusLength,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        })
    }

    static sign(
        rawMessage: string,
        privateKey: string,
        algorithm = 'sha256',
        padding = crypto.constants.RSA_PKCS1_PSS_PADDING,
    ) {
        const signature = crypto.sign(algorithm, Buffer.from(rawMessage), {
            key: privateKey,
            padding,
        })
        return signature.toString('base64')
    }

    static verify(
        rawMessage: string,
        publicKey: string,
        signature: string,
        padding = crypto.constants.RSA_PKCS1_PSS_PADDING,
    ) {
        return crypto.verify(
            'sha256',
            Buffer.from(rawMessage),
            {
                key: publicKey,
                padding,
            },
            Buffer.from(signature, 'base64'),
        )
    }
}
