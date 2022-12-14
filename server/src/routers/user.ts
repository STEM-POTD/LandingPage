import { publicProcedure, router } from '../utils/trpc'
import { z } from 'zod'
import { compare, hash } from 'bcryptjs'
import { signJwt } from '../utils/jwt'
import { CookieOptions } from 'express'
import { TRPCError } from '@trpc/server'

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
}

const accessTokenCookieOptions: CookieOptions = {
    ...cookieOptions,
    expires: new Date(Date.now() + 15 * 60 * 1000),
}

const refreshTokenCookieOptions: CookieOptions = {
    ...cookieOptions,
    expires: new Date(Date.now() + 15 * 60 * 1000),
}

export const userRouter = router({
    createUser: publicProcedure
        .input(
            z.object({
                name: z.string(),
                email: z.string(),
                password: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { name, email, password } }) => {
            const hashedPassword = await hash(password, 12)
            const user = await ctx.prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            })

            return {
                user,
                status: 'success',
            }
        }),

    signInUser: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { email, password } }) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    email,
                },
            })

            if (!user) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'User not found',
                })
            }

            const passwordMatch = await compare(password, user.password)

            const accessToken = signJwt(user, 'accessTokenPrivateKey')
            const refreshToken = signJwt(user, 'refreshTokenPrivateKey')

            ctx.res.cookie(
                'access_token',
                accessToken,
                accessTokenCookieOptions
            )

            ctx.res.cookie(
                'refresh_token',
                refreshToken,
                refreshTokenCookieOptions
            )

            ctx.res.cookie('logged_in', true, {
                ...accessTokenCookieOptions,
                httpOnly: false,
            })

            if (!passwordMatch) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Incorrect password',
                })
            }

            return {
                user,
                status: 'success',
            }
        }),

    getUsersByScore: publicProcedure.query(async ({ ctx }) => {
        const users = await ctx.prisma.user.findMany({
            orderBy: {
                score: 'desc',
            },
        })

        return users
    }),
})
