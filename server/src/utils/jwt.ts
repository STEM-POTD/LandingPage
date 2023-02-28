import { z } from 'zod'
import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from './default'

export const signJwt = (
    payload: object,
    key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options: SignOptions = {}
) => {
    const envKey = key === 'accessTokenPrivateKey' ? env.ACCESS_TOKEN_PRIVATE_KEY : env.REFRESH_TOKEN_PRIVATE_KEY

    const privateKey = Buffer.from(
        envKey,
        'base64'
    ).toString('ascii')

    console.log(privateKey)

    return jwt.sign(payload, privateKey, {
        ...(options && options),
        algorithm: 'RS256',
    })
}

export const decodeAndVerifyJwt = (
    token: string,
    key: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) => {
    try {
        const publicKey = Buffer.from(
            key === 'accessTokenPublicKey'
                ? env.ACCESS_TOKEN_PUBLIC_KEY
                : env.REFRESH_TOKEN_PUBLIC_KEY,
            'base64'
        ).toString('ascii')
        const decoded = jwt.decode(token)

        const userValidator = z.object({
            id: z.string().cuid(),
            email: z.string().email(),
            name: z.string(),
            role: z.enum(['ADMIN', 'USER']),
            password: z.string(),
            provider: z.string().nullable(),
            createdAt: z.coerce.date(),
            updatedAt: z.coerce.date(),
            score: z.number(),
        })

        const decodedJwt = userValidator.parse(decoded)

        return decodedJwt
    } catch (error) {
        console.log(error)
        return null
    }
}
