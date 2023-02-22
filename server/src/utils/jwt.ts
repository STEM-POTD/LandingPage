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
        ...(options && options),
        algorithm: 'RS256',
        expiresIn: '15m',
    })
}

export const decodeAndVerifyJwt = <T>(
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

        return jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
        }) as T
    } catch (error) {
        console.log(error)
        return null
    }
}
