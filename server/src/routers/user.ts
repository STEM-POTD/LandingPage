import { middleware, publicProcedure, router } from '../utils/trpc'
import { z } from 'zod'
import { compare, hash } from 'bcryptjs'
import { signJwt } from '../utils/jwt'
import type { CookieOptions } from 'express'
import { TRPCError } from '@trpc/server'
import { User } from '@prisma/client'

type ResponseType<T, K> = { status: 'success', data: T } | { status: 'error', error: K }

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

const isAuthed = middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
        })
    }

    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    })
})

export const authedProcedure = publicProcedure.use(isAuthed)

const authRouter = router({
    solveProblem: authedProcedure
        .input(
            z.object({
                problemId: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { problemId } }): Promise<ResponseType<User, TRPCError>> => {
            const problem = await ctx.prisma.problem.findUniqueOrThrow({
                where: {
                    id: problemId,
                },
            })

            const updatedUser = await ctx.prisma.user.update({
                where: {
                    id: ctx.user.id,
                },
                data: {
                    solved: {
                        connect: {
                            id: problemId,
                        },
                    },
                    score: {
                        increment: problem.score,
                    },
                },
            })

            return {
                data: updatedUser,
                status: 'success',
            }
        }),

    updateUser: authedProcedure
        .input(
            z.object({
                name: z.string().optional(),
                email: z.string().email().optional(),
                password: z
                    .string()
                    .transform(async (value) => await hash(value, 12))
                    .optional(),
            })
        )
        .mutation(async ({ ctx, input: { name, email, password } }) => {
            const user = await ctx.prisma.user.update({
                where: {
                    id: ctx.user.id,
                },
                data: {
                    ...ctx.user,
                    name,
                    email,
                    password,
                },
            })

            return {
                data: user,
                status: 'success',
            }
        }),

    logout: authedProcedure
        .mutation(async ({ ctx }) => {
            ctx.res.clearCookie('accessToken', accessTokenCookieOptions)
            ctx.res.clearCookie('refreshToken', refreshTokenCookieOptions)
            ctx.res.cookie('logged_in', false, {
                ...cookieOptions,
                httpOnly: false,
            })

            ctx.redis.del(ctx.user.id)

            return {
                status: 'success',
            }
        }),

    getUser: authedProcedure.query(async ({ ctx }) => {
        return {
            data: ctx.user,
            status: 'success',
        }
    }),
})

export const userRouter = router({
    register: publicProcedure
        .input(
            z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string().transform(async (value) => await hash(value, 12))
            })
        )
        .mutation(async ({ ctx, input: { name, email, password } }): Promise<ResponseType<User, TRPCError>> => {
            try {
                const user = await ctx.prisma.user.create({
                    data: {
                        name,
                        email,
                        password,
                    },
                })

                return {
                    data: user,
                    status: 'success',
                }
            } catch (error) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Email already exists',
                })
            }
        }),

    login: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string(),
            })
        )
        .mutation(
            async ({
                ctx,
                input: { email, password },
            }): Promise<ResponseType<{
                accessToken: string
            }, TRPCError>> => {
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        email,
                    },
                })

                if (!user) {
                    return {
                        status: 'error',
                        error: new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'User not found',
                        }),
                    }
                }

                const passwordMatch = await compare(password, user.password)

                if (!passwordMatch) {
                    return {
                        status: 'error',
                        error: new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Incorrect password',
                        }),
                    }
                }

                ctx.redis.set(user.id, JSON.stringify(user), { EX: 60 * 15 })

                const accessToken = signJwt(user, 'accessTokenPrivateKey')
                const refreshToken = signJwt({ sub: user.id }, 'refreshTokenPrivateKey')

                ctx.res.cookie('accessToken', accessToken, accessTokenCookieOptions)
                ctx.res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
                ctx.res.cookie('logged_in', true, {
                    ...accessTokenCookieOptions,
                    httpOnly: false,
                })

                return {
                    status: 'success',
                    data: {
                        accessToken,
                    },
                }
            }
        ),



    getUsersByScore: publicProcedure.query(async ({ ctx }) => {
        const users = await ctx.prisma.user.findMany({
            orderBy: {
                score: 'desc',
            },
        })

        return users
    }),

    update: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string()
            })
        ).mutation(async ({ ctx, input: { email, password } }): Promise<ResponseType<User, TRPCError>> => {
            const user = await ctx.prisma.user.findFirstOrThrow({
                where: {
                    email,
                }
            })

            const match = password === user.password

            if (!match) {
                return {
                    status: 'error',
                    error: new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Incorrect password',
                    })
                }
            }

            return {
                status: 'success',
                data: user,
            }
        }),

    authed: authRouter,
})
