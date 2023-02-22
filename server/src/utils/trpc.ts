import { inferAsyncReturnType, initTRPC } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { decodeAndVerifyJwt } from './jwt'
import { z, ZodError } from 'zod'
import superjson from 'superjson'
import redisClient from './redis'
import { isDeepStrictEqual } from 'util'
import { User } from '@prisma/client'

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {

    const getUserFromHeader = async () => {
        if (req.headers.authorization) {
            // const decoded = decodeAndVerifyJwt<User>(
            //     req.headers.authorization,
            //     'accessTokenPublicKey'
            // )
            // console.log({ id: decoded })
            // if (!decoded) {
            //     return null
            // }

            // const session = await redisClient.get(decoded.id)

            // if (!session) {
            //     return null
            // }

            // const userValidator = z.object({
            //     id: z.string().cuid(),
            //     email: z.string().email(),
            //     name: z.string(),
            //     role: z.enum(['ADMIN', 'USER']),
            //     password: z.string(),
            //     provider: z.string().nullable(),
            //     createdAt: z.coerce.date(),
            //     updatedAt: z.coerce.date(),
            //     score: z.number(),
            // })

            // const sessionUser = userValidator.safeParse(JSON.parse(session))

            // if (!sessionUser.success) {
            //     return null
            // }

            // const { id: userId } = sessionUser.data

            // const user = await prisma.user.findUnique({
            //     where: {
            //         id: userId,
            //     },
            // })

            // if (!isDeepStrictEqual(user, sessionUser.data))
            //     redisClient.set(userId, JSON.stringify(user))

            // if (!user)
            //     return null

            // return user
        }
        return null
    }


    return ({
        req,
        res,
        prisma,
        redis: redisClient,
        user: await getUserFromHeader(),
    })
}

export type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter: ({ error, shape }) => {
        if (error.code === 'INTERNAL_SERVER_ERROR' || error.code === 'UNAUTHORIZED') {
            console.error(error)
        }
        return {
            ...shape,
            message: error.message,
            zodError: error instanceof ZodError ? error.format() : undefined,
        }
    },
})

export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure
export const mergeRouters = t.mergeRouters
