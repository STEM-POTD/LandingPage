import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from './default'

export const signJwt = (
    payload: Object,
    key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options: SignOptions = {}
) => {
    const privateKey = Buffer.from(
        key === 'accessTokenPrivateKey'
            ? env.ACCESS_TOKEN_PRIVATE_KEY
            : env.REFRESH_TOKEN_PRIVATE_KEY,
        'base64'
    ).toString('ascii')
    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '15m',
        ...(options && options),
    })
}

export const verifyJwt = <T>(
    token: string,
    key: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null => {
    try {
        const publicKey = Buffer.from(
            key === 'accessTokenPublicKey'
                ? env.ACCESS_TOKEN_PUBLIC_KEY
                : env.REFRESH_TOKEN_PUBLIC_KEY,
            'base64'
        ).toString('ascii')
        return jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
        }) as T
    } catch (error) {
        return null
    }
}
