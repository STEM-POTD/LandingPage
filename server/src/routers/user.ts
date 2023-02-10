import { publicProcedure, router } from '../utils/trpc'
import { z } from 'zod'
import { compare, hash } from 'bcryptjs'
import { signJwt } from '../utils/jwt'
import { CookieOptions } from 'express'
import { TRPCError } from '@trpc/server'
import { User } from '@prisma/client'

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
            try {
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
            } catch (error) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Email already exists',
                })
            }
        }),

    signInUser: publicProcedure
        .input(
            z.object({
                email: z.string(),
                password: z.string(),
            })
        )
        .mutation(
            async ({
                ctx,
                input: { email, password },
            }): Promise<
                | {
                      status: 'success'
                      data: {
                          user: User
                          accessToken: string
                      }
                  }
                | {
                      status: 'error'
                      error: TRPCError
                  }
            > => {
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

                const accessToken = signJwt(user, 'accessTokenPrivateKey')

                if (!passwordMatch) {
                    return {
                        status: 'error',
                        error: new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Incorrect password',
                        }),
                    }
                }

                return {
                    status: 'success',
                    data: {
                        user,
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

    solveProblem: publicProcedure
        .input(
            z.object({
                problemId: z.string(),
                userId: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { problemId, userId } }) => {
            const problem = await ctx.prisma.problem.findUniqueOrThrow({
                where: {
                    id: problemId,
                },
            })

            const updatedUser = await ctx.prisma.user.update({
                where: {
                    id: userId,
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
                user: updatedUser,
                status: 'success',
            }
        }),

    updateUser: publicProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                email: z.string().email().optional(),
                password: z
                    .string()
                    .transform(async (value) => await hash(value, 12))
                    .optional(),
            })
        )
        .mutation(async ({ ctx, input: { id, name, email, password } }) => {
            const user = await ctx.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    name,
                    email,
                    password,
                },
            })

            return {
                user,
                status: 'success',
            }
        }),
})
