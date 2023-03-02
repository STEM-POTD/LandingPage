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

    return jwt.sign(payload, privateKey, {
        ...options,
        algorithm: 'RS256',
        expiresIn: '1d'
    })
}

export const decodeAndVerifyJwt = (
    token: string,
    key: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) => {
    try {
        const envKey = key === 'accessTokenPublicKey'
            ? env.ACCESS_TOKEN_PUBLIC_KEY
            : env.REFRESH_TOKEN_PUBLIC_KEY

        const publicKey = Buffer.from(
            envKey,
            'base64'
        ).toString('ascii')

        const decoded = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
        })

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

        return userValidator.parse(decoded)
    } catch (error) {
        console.log(error)
        return null
    }
}
